import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCaseById } from '../api/cases';
import { getDocuments, uploadDocument, deleteDocument } from '../api/documents';
import { deleteCase } from '../api/cases';
import { askQuestion } from '../api/qa';
import { getFlags } from '../api/risks';
import DashboardLayout from '../components/DashboardLayout';

const statusLabel = {
  uploaded: { label: 'queued', color: 'text-dim2' },
  processing: { label: 'processing', color: 'text-goldbright' },
  processed: { label: 'ready', color: 'text-moss' },
  failed: { label: 'failed', color: 'text-flag' },
};

const severityBorder = {
  high: 'border-flag/60 bg-flag/[0.05]',
  moderate: 'border-gold/60 bg-gold/[0.05]',
  low: 'border-moss/60 bg-moss/[0.05]',
};

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [flags, setFlags] = useState([]);
  const [activeTab, setActiveTab] = useState('flags');
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-[13px] text-dim">Loading case…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <p className="font-mono text-[10.5px] text-dim2">CASE #{String(id).padStart(3, '0')}</p>
          <h1 className="mt-1 font-display text-4xl italic text-parchment">{caseData?.title}</h1>
          {caseData?.description && <p className="mt-1 text-[13px] text-dim">{caseData.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileSelect} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2.5 font-mono text-[12px] uppercase text-goldbright transition-colors hover:bg-gold/20 disabled:opacity-60"
          >
            {uploading ? 'UPLOADING…' : '+ UPLOAD DOCUMENT'}
          </button>
          <button
            onClick={handleDeleteCase}
            disabled={deletingCase}
            className="rounded-full border border-flag/40 bg-flag/10 px-4 py-2.5 font-mono text-[12px] uppercase text-flag transition-colors hover:bg-flag/20 disabled:opacity-60"
          >
            {deletingCase ? 'DELETING…' : 'DELETE CASE'}
          </button>
        </div>
      </div>
      {uploadError && <p className="mt-3 rounded-lg border border-flag/30 bg-flag/10 px-3.5 py-2.5 text-[13px] text-flag">{uploadError}</p>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[240px_1fr]">
        {/* Documents */}
        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dim2">Documents ({readyDocsCount}/{documents.length})</p>
          <div className="space-y-2">
            {documents.map((doc) => {
              const s = statusLabel[doc.upload_status] || statusLabel.uploaded;
              return (
                <div key={doc.id} className="rounded-lg border border-white/[0.06] bg-ink2/50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-mono text-[10px] ${s.color}`}>{s.label}</span>
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
                  <p className="mt-2 truncate text-[12.5px] text-parchment">{doc.filename}</p>
                </div>
              );
            })}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border border-dashed border-white/[0.1] px-3 py-6 text-center font-mono text-[11px] uppercase text-dim transition-colors hover:border-gold/40"
            >
              {documents.length === 0 ? 'UPLOAD YOUR FIRST DOCUMENT' : '+ ADD ANOTHER FILE'}
            </button>
          </div>
        </div>

        {/* Analysis column */}
        <div>
          <div className="mb-4 flex w-fit gap-1 rounded-full border border-white/[0.06] p-1">
            <button
              onClick={() => setActiveTab('flags')}
              className={`rounded-full px-4 py-1.5 font-mono text-[11.5px] transition-colors ${activeTab === 'flags' ? 'bg-gold text-ink' : 'text-dim hover:text-parchment'}`}
            >
              Risk Flags {flags.length > 0 && <span className="ml-1 opacity-70">{flags.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`rounded-full px-4 py-1.5 font-mono text-[11.5px] transition-colors ${activeTab === 'chat' ? 'bg-gold text-ink' : 'text-dim hover:text-parchment'}`}
            >
              Ask Anything
            </button>
          </div>

          {activeTab === 'flags' ? (
            <div className="rounded-xl border border-white/[0.06] bg-ink2/50 p-6" style={{ minHeight: 420 }}>
              {flags.length === 0 ? (
                <p className="py-16 text-center text-[13px] text-dim">
                  {documents.length === 0 ? 'Upload a document to see flagged risks here.' : 'No risks flagged yet.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {flags.map((flag) => (
                    <div key={flag.id} className={`rounded-lg border-l-2 py-2.5 pl-4 pr-4 ${severityBorder[flag.severity] || severityBorder.low}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-dim">{flag.severity} Risk</span>
                        <span className="truncate font-mono text-[10px] text-dim2">{flag.filename}</span>
                      </div>
                      <p className="mt-1.5 text-[13.5px] text-parchment/90">{flag.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col rounded-xl border border-white/[0.06] bg-ink2/50" style={{ minHeight: 480 }}>
              <div className="flex-1 space-y-4 overflow-y-auto p-5" style={{ maxHeight: 460 }}>
                {messages.length === 0 ? (
                  <p className="py-16 text-center text-[13px] text-dim">
                    {readyDocsCount === 0 ? 'Upload a document to start asking questions.' : 'Ask anything about this case.'}
                  </p>
                ) : (
                  messages.map((m, i) => (
                    <div key={i}>
                      {m.role === 'user' ? (
                        <>
                          <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-gold">question</p>
                          <p className="text-[13.5px] text-dim">{m.text}</p>
                        </>
                      ) : (
                        <div className={`mt-3 rounded-lg border p-4 ${m.error ? 'border-flag/30 bg-flag/[0.06]' : 'border-white/[0.06] bg-ink/50'}`}>
                          <p className={`mb-2 font-mono text-[10px] uppercase tracking-wide ${m.error ? 'text-flag' : 'text-moss'}`}>Response</p>
                          <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-parchment/90">{m.text}</p>
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
                {asking && <p className="font-mono text-[11px] text-dim2">thinking…</p>}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleAsk} className="border-t border-white/[0.06] p-3.5">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={readyDocsCount === 0}
                  placeholder={readyDocsCount === 0 ? 'Waiting for a document…' : 'Ask anything about this case…'}
                  className="w-full rounded-full border border-white/[0.08] bg-ink px-4 py-2.5 text-[13px] text-parchment placeholder:text-dim2 focus:border-gold focus:outline-none transition-colors disabled:cursor-not-allowed"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}