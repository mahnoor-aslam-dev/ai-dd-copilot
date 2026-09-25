import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCaseById } from '../api/cases';
import { getDocuments, uploadDocument, deleteDocument } from '../api/documents';
import { deleteCase } from '../api/cases';
import { askQuestion } from '../api/qa';
import { getFlags } from '../api/risks';
import DashboardLayout from '../components/DashboardLayout';

const statusMeta = {
  uploaded: { label: 'Queued', color: 'text-dim2', dot: 'bg-dim2' },
  processing: { label: 'Processing', color: 'text-goldbright', dot: 'bg-goldbright' },
  processed: { label: 'Ready', color: 'text-moss', dot: 'bg-moss' },
  failed: { label: 'Failed', color: 'text-flag', dot: 'bg-flag' },
};

const severityMeta = {
  high: { label: 'High', color: 'text-flag', bg: 'bg-flag/10' },
  moderate: { label: 'Moderate', color: 'text-gold', bg: 'bg-gold/10' },
  low: { label: 'Low', color: 'text-goldbright', bg: 'bg-goldbright/10' },
  clean: { label: 'No Issues', color: 'text-moss', bg: 'bg-moss/10' },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'low', label: 'Low' },
];

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [flags, setFlags] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [deletingCase, setDeletingCase] = useState(false);
  const fileInputRef = useRef(null);
  const pollRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadCase();
    loadDocuments();
    loadFlags();
    return () => clearInterval(pollRef.current);
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadCase() {
    try {
      const res = await getCaseById(id);
      setCaseData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDocuments() {
    try {
      const res = await getDocuments(id);
      setDocuments(res.data);
      const stillProcessing = res.data.some((d) => d.upload_status === 'uploaded' || d.upload_status === 'processing');
      if (stillProcessing && !pollRef.current) {
        pollRef.current = setInterval(async () => {
          const poll = await getDocuments(id);
          setDocuments(poll.data);
          const done = poll.data.every((d) => d.upload_status === 'processed' || d.upload_status === 'failed');
          if (done) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            loadFlags();
          }
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadFlags() {
    try {
      const res = await getFlags(id);
      setFlags(res.data);
    } catch (err) {
      console.error('Failed to load flags', err);
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      await uploadDocument(id, file);
      await loadDocuments();
    } catch (err) {
      setUploadError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDeleteDocument(docId) {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    setDeletingDocId(docId);
    try {
      await deleteDocument(id, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      loadFlags();
    } catch (err) {
      console.error(err);
      alert('Failed to delete document.');
    } finally {
      setDeletingDocId(null);
    }
  }

  async function handleDeleteCase() {
    if (!window.confirm(`Delete the case "${caseData?.title}" and all its documents? This cannot be undone.`)) return;
    setDeletingCase(true);
    try {
      await deleteCase(id);
      navigate('/cases');
    } catch (err) {
      console.error(err);
      alert('Failed to delete case.');
      setDeletingCase(false);
    }
  }

  async function handleAsk(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || asking) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setAsking(true);

    try {
      const res = await askQuestion(id, q);
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.answer, sources: res.data.sources }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: err.response?.data?.error || 'Something went wrong.', error: true }]);
    } finally {
      setAsking(false);
    }
  }

  const readyDocsCount = documents.filter((d) => d.upload_status === 'processed').length;

  // Build a unified row list: real flags + "no issues" rows for clean documents
  const processedDocs = documents.filter((d) => d.upload_status === 'processed');
  const flaggedDocIds = new Set(flags.map((f) => f.document_id));
  const cleanDocs = processedDocs.filter((d) => !flaggedDocIds.has(d.id));

  const allRows = [
    ...flags.map((f) => ({ ...f, isClean: false })),
    ...cleanDocs.map((d) => ({
      id: `clean-${d.id}`,
      filename: d.filename,
      severity: 'clean',
      description: 'No issues were found in this document.',
      isClean: true,
    })),
  ];

  const filteredRows = severityFilter === 'all' ? allRows : allRows.filter((r) => r.severity === severityFilter);
  const counts = {
    all: allRows.length,
    high: flags.filter((f) => f.severity === 'high').length,
    moderate: flags.filter((f) => f.severity === 'moderate').length,
    low: flags.filter((f) => f.severity === 'low').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-[13px] text-dim">Loading case…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* ===== Header ===== */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim2">Case #{String(id).padStart(3, '0')}</p>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-parchment sm:text-4xl">
            {caseData?.title}
          </h1>
          {caseData?.description && <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-dim">{caseData.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileSelect} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full bg-gradient-to-r from-goldbright to-gold px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : '+ Upload Document'}
          </button>
          <button
            onClick={handleDeleteCase}
            disabled={deletingCase}
            className="rounded-full border border-flag/40 bg-flag/10 px-4 py-2.5 font-mono text-[12px] uppercase tracking-wide text-flag transition-colors hover:bg-flag/20 disabled:opacity-60"
          >
            {deletingCase ? 'Deleting…' : 'Delete Case'}
          </button>
        </div>
      </div>
      {uploadError && <p className="mt-3 rounded-lg border border-flag/30 bg-flag/10 px-3.5 py-2.5 text-[13px] text-flag">{uploadError}</p>}

      {/* ===== Section 1: Documents ===== */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-parchment">Documents</h2>
          <span className="rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-[10.5px] text-dim">
            {readyDocsCount}/{documents.length} ready
          </span>
        </div>

        {documents.length === 0 ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-12 text-center transition-colors hover:border-goldbright/40"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-dim2">
              <path d="M12 13v8M8.5 16.5 12 13l3.5 3.5" /><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
            </svg>
            <span className="text-[13px] text-dim">Drop a PDF here, or click to upload your first document</span>
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => {
              const s = statusMeta[doc.upload_status] || statusMeta.uploaded;
              return (
                <div key={doc.id} className="rounded-xl border border-white/[0.06] bg-ink2/50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-dim">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
                      </svg>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      disabled={deletingDocId === doc.id}
                      className="text-dim2 transition-colors hover:text-flag disabled:opacity-40"
                      title="Delete document"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-3 truncate text-[13px] font-medium text-parchment">{doc.filename}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${doc.upload_status === 'processing' ? 'animate-pulse' : ''}`} />
                    <span className={`font-mono text-[10px] uppercase tracking-wide ${s.color}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.12] px-4 py-6 text-center transition-colors hover:border-goldbright/40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-dim2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-[11.5px] text-dim">Add another file</span>
            </button>
          </div>
        )}
      </section>

      {/* ===== Section 2: Risk Flags (table) ===== */}
      <section className="mt-14">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-parchment">Risk Review</h2>
          <div className="flex gap-1 rounded-full border border-white/[0.06] p-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSeverityFilter(tab.key)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                  severityFilter === tab.key ? 'bg-gradient-to-r from-goldbright to-gold text-ink' : 'text-dim hover:text-parchment'
                }`}
              >
                {tab.label} <span className="opacity-70">{counts[tab.key]}</span>
              </button>
            ))}
          </div>
        </div>

        {documents.length === 0 ? (
          <p className="rounded-xl border border-white/[0.06] bg-ink2/40 py-12 text-center text-[13px] text-dim">
            Upload a document to see it reviewed here.
          </p>
        ) : readyDocsCount === 0 ? (
          <p className="rounded-xl border border-white/[0.06] bg-ink2/40 py-12 text-center text-[13px] text-dim">
            Still reviewing your document — check back in a moment.
          </p>
        ) : filteredRows.length === 0 ? (
          <p className="rounded-xl border border-white/[0.06] bg-ink2/40 py-12 text-center text-[13px] text-dim">
            No items match this filter.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] font-mono text-[10.5px] uppercase tracking-wide text-dim2">
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">What we found</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => {
                  const sev = severityMeta[row.severity] || severityMeta.low;
                  return (
                    <tr key={row.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 align-top">
                        <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${sev.bg} ${sev.color}`}>{sev.label}</span>
                      </td>
                      <td className="px-4 py-3.5 align-top font-mono text-[11px] text-dim2 whitespace-nowrap">{row.filename}</td>
                      <td className="px-4 py-3.5 align-top leading-relaxed text-parchment/90">{row.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===== Section 3: Ask Anything ===== */}
      <section className="mt-14 mb-6">
        <h2 className="mb-4 font-display text-lg font-bold text-parchment">Ask Anything</h2>

        <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-ink2/50" style={{ minHeight: 420 }}>
          <div className="flex-1 space-y-4 overflow-y-auto p-5" style={{ maxHeight: 420 }}>
            {messages.length === 0 ? (
              <p className="py-14 text-center text-[13px] text-dim">
                {readyDocsCount === 0 ? 'Upload a document to start asking questions.' : 'Ask anything about this case — answers are backed by the exact source.'}
              </p>
            ) : (
              messages.map((m, i) => (
                <div key={i}>
                  {m.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-gradient-to-r from-goldbright to-gold px-4 py-2.5 text-[13px] font-medium text-ink">
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-2 rounded-xl border p-4 ${m.error ? 'border-flag/30 bg-flag/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-parchment/90">{m.text}</p>
                      {m.sources?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-3">
                          {m.sources.map((s, si) => (
                            <span key={si} className="rounded-full bg-moss/10 px-2.5 py-1 font-mono text-[10px] text-moss">
                              doc #{s.document_id} · {s.relevance_score}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            {asking && (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-dim2" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-dim2" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-dim2" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleAsk} className="border-t border-white/[0.06] p-4">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] py-1.5 pl-5 pr-1.5 transition-colors focus-within:border-goldbright/50">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={readyDocsCount === 0}
                placeholder={readyDocsCount === 0 ? 'Waiting for a document to finish processing…' : 'Ask anything about this case…'}
                className="w-full bg-transparent text-[13px] text-parchment placeholder:text-dim2 outline-none focus:outline-none disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!question.trim() || asking || readyDocsCount === 0}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-goldbright to-gold text-ink transition-transform hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
} 