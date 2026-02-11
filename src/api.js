const API_URL = 'http://localhost:3000';

//Authenticating
export const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
};

//API integration
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  return response;
};