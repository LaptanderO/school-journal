const API_BASE = '/api';

const api = {
  // Students
  getStudents: () => fetch(`${API_BASE}/students`).then(res => res.json()),
  getStudent: (id) => fetch(`${API_BASE}/students/${id}`).then(res => res.json()),
  createStudent: (data) => fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateStudent: (id, data) => fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteStudent: (id) => fetch(`${API_BASE}/students/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),
  
    // Teachers
  getTeachers: () => fetch(`${API_BASE}/teachers`).then(res => res.json()),
  getTeacher: (id) => fetch(`${API_BASE}/teachers/${id}`).then(res => res.json()),
  createTeacher: (data) => fetch(`${API_BASE}/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateTeacher: (id, data) => fetch(`${API_BASE}/teachers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteTeacher: (id) => fetch(`${API_BASE}/teachers/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),
  getTeacherWorkload: (id) => fetch(`${API_BASE}/teachers/${id}/workload`).then(res => res.json()),
  
  // Subjects
  getSubjects: () => fetch(`${API_BASE}/subjects`).then(res => res.json()),
  createSubject: (data) => fetch(`${API_BASE}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateSubject: (id, data) => fetch(`${API_BASE}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteSubject: (id) => fetch(`${API_BASE}/subjects/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),
  getSubjectStatistics: (id) => fetch(`${API_BASE}/subjects/${id}/statistics`).then(res => res.json()),
  
  // Classes
  getClasses: () => fetch(`${API_BASE}/classes`).then(res => res.json()),
  createClass: (data) => fetch(`${API_BASE}/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateClass: (id, data) => fetch(`${API_BASE}/classes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteClass: (id) => fetch(`${API_BASE}/classes/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),
  getClassStudentsCount: (id) => fetch(`${API_BASE}/classes/${id}/students-count`).then(res => res.json()),
 
  // Grades
  getGrades: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetch(`${API_BASE}/grades${params ? '?' + params : ''}`).then(res => res.json());
  },
  createGrade: (data) => fetch(`${API_BASE}/grades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  getFailingStudents: () => fetch(`${API_BASE}/grades/failing`).then(res => res.json()),
  getClassReport: (classId) => fetch(`${API_BASE}/grades/class/${classId}/report`).then(res => res.json())
};

export default api;