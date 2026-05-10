const API_BASE = '/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Ошибка запроса');
  }
  return data;
};

const api = {
  // Students
  getStudents: () => fetch(`${API_BASE}/students`).then(handleResponse),
  getStudent: (id) => fetch(`${API_BASE}/students/${id}`).then(handleResponse),
  createStudent: (data) => fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateStudent: (id, data) => fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteStudent: (id) => fetch(`${API_BASE}/students/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(handleResponse),
  
  // Teachers
  getTeachers: () => fetch(`${API_BASE}/teachers`).then(handleResponse),
  getTeacher: (id) => fetch(`${API_BASE}/teachers/${id}`).then(handleResponse),
  createTeacher: (data) => fetch(`${API_BASE}/teachers`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateTeacher: (id, data) => fetch(`${API_BASE}/teachers/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteTeacher: (id) => fetch(`${API_BASE}/teachers/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(handleResponse),
  getTeacherWorkload: (id) => fetch(`${API_BASE}/teachers/${id}/workload`).then(handleResponse),
  
  // Subjects
  getSubjects: () => fetch(`${API_BASE}/subjects`).then(handleResponse),
  createSubject: (data) => fetch(`${API_BASE}/subjects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateSubject: (id, data) => fetch(`${API_BASE}/subjects/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteSubject: (id) => fetch(`${API_BASE}/subjects/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(handleResponse),
  getSubjectStatistics: (id) => fetch(`${API_BASE}/subjects/${id}/statistics`).then(handleResponse),
  
  // Classes
  getClasses: () => fetch(`${API_BASE}/classes`).then(handleResponse),
  createClass: (data) => fetch(`${API_BASE}/classes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  updateClass: (id, data) => fetch(`${API_BASE}/classes/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  deleteClass: (id) => fetch(`${API_BASE}/classes/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(handleResponse),
  getClassStudentsCount: (id) => fetch(`${API_BASE}/classes/${id}/students-count`).then(handleResponse),
  
  // Grades
  getGrades: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetch(`${API_BASE}/grades${params ? '?' + params : ''}`).then(handleResponse);
  },
  createGrade: (data) => fetch(`${API_BASE}/grades`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),
  getFailingStudents: () => fetch(`${API_BASE}/grades/failing`).then(handleResponse),
  getClassReport: (classId) => fetch(`${API_BASE}/grades/class/${classId}/report`).then(handleResponse),
};

export default api;