import apiClient from './client';

export const askQuestion = (caseId, question) =>
  apiClient.post(`/qa/${caseId}/ask`, { question });