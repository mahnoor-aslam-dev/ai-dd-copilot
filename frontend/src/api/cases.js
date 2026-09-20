import apiClient from './client';

export const getCases = () => apiClient.get('/cases');

export const createCase = (title, description) =>
  apiClient.post('/cases', { title, description });

export const getCaseById = (id) => apiClient.get(`/cases/${id}`);

export const deleteCase = (id) => apiClient.delete(`/cases/${id}`);