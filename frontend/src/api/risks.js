import apiClient from './client';

export const getFlags = (caseId) => apiClient.get(`/risks/${caseId}`);