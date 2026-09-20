import apiClient from './client';

export const getRules = () => apiClient.get('/rules');