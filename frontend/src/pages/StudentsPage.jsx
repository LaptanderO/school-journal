import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import StudentForm from '../components/StudentForm'

const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [filterClass, setFilterClass] = useState('')

  const loadData = useCallback(async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.getStudents(),
        api.getClasses()
      ])
      setStudents(studentsRes.data || [])
      setClasses(classesRes.data || [])
    } catch {
      console.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id, name) => {
    if (window.confirm(`Удалить ученика "${name}"?`)) {
      try {
        await api.deleteStudent(id)
        loadData()
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingStudent(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingStudent(null)
    loadData()
  }

  const filteredStudents = filterClass
    ? students.filter(s => s.class_id === parseInt(filterClass))
    : students

  if (loading) return <div className="content">Загрузка...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Список учеников</h2>
        <button className="success" onClick={handleAdd}>
          ➕ Добавить ученика
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>Фильтр по классу: </label>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">Все классы</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Дата рождения</th>
            <th>Адрес</th>
            <th>Класс</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Нет учеников</td></tr>
          ) : (
            filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.full_name}</td>
                <td>{student.birth_date || '-'}</td>
                <td>{student.address || '-'}</td>
                <td>{student.class?.name || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(student)}>✏️</button>
                  <button className="danger" onClick={() => handleDelete(student.id, student.full_name)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <StudentForm
          student={editingStudent}
          classes={classes}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

export default StudentsPage