import apiClient from './client';

export const uploadDocument = (caseId, file) => {
  const formData = new FormData();
  formData.append('document', file);
  return apiClient.post(`/documents/${caseId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDocuments = (caseId) => apiClient.get(`/documents/${caseId}`);

export const deleteDocument = (caseId, docId) => apiClient.delete(`/documents/${caseId}/${docId}`);