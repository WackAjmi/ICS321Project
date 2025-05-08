import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const testConnection = async () => {
  const res = await axios.get(`${API_BASE}/test-db`);
  return res.data;
};
