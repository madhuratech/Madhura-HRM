import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token automatically from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hrm_token');
      localStorage.removeItem('hrm_user');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
};

// ─── EMPLOYEES ───────────────────────────────────────────
export const employeesAPI = {
  getAll:  (params) => api.get('/employees', { params }),
  getById: (id)     => api.get(`/employees/${id}`),
  create:  (data)   => api.post('/employees', data),
  update:  (id, data) => api.put(`/employees/${id}`, data),
  remove:  (id)     => api.delete(`/employees/${id}`),
  stats:   ()       => api.get('/employees/stats/summary'),
};

// ─── SALES ───────────────────────────────────────────────
export const salesAPI = {
  getAll:  (params) => api.get('/sales', { params }),
  create:  (data)   => api.post('/sales', data),
  update:  (id, data) => api.put(`/sales/${id}`, data),
  remove:  (id)     => api.delete(`/sales/${id}`),
  stats:   ()       => api.get('/sales/stats/summary'),
};

// ─── ENQUIRIES ───────────────────────────────────────────
export const enquiriesAPI = {
  getAll:     (params)       => api.get('/enquiries', { params }),
  create:     (data)         => api.post('/enquiries', data),
  update:     (id, data)     => api.put(`/enquiries/${id}`, data),
  remove:     (id)           => api.delete(`/enquiries/${id}`),
  addRemark:  (id, data)     => api.post(`/enquiries/${id}/remarks`, data),
};

// ─── TASKS ───────────────────────────────────────────────
export const tasksAPI = {
  getAll:  (params) => api.get('/tasks', { params }),
  getById: (id)     => api.get(`/tasks/${id}`),
  create:  (data)   => api.post('/tasks', data),
  update:  (id, data) => api.put(`/tasks/${id}`, data),
  remove:  (id)     => api.delete(`/tasks/${id}`),
};

// ─── ATTENDANCE ──────────────────────────────────────────
export const attendanceAPI = {
  punch:     (data)         => api.post('/attendance/punch', data),
  today:     (employeeId)   => api.get(`/attendance/today/${employeeId}`),
  recent:    (employeeId)   => api.get(`/attendance/recent/${employeeId}`),
  allToday:  (params)       => api.get('/attendance/all', { params }),
};

export default api;
