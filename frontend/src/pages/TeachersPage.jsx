import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import TeacherForm from '../components/TeacherForm'
import useAuth from '../hooks/useAuth'

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)

  const { canCreateTeacher, canDelete, canEdit } = useAuth()

  const loadData = useCallback(async () => {
    try {
      const res = await api.getTeachers()
      setTeachers(res.data || [])
    } catch {
      console.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id, name) => {
    if (window.confirm(`Удалить учителя "${name}"?`)) {
      try {
        await api.deleteTeacher(id)
        loadData()
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingTeacher(null)
    setShowForm(true)
  }

  if (loading) return <div className="content">Загрузка...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Учителя</h2>
        {canCreateTeacher && (
          <button className="success" onClick={handleAdd}>
           ➕ Добавить учителя
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Телефон</th>
            <th>Дата рождения</th>
            <th>Дата приёма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Нет учителей</td></tr>
          ) : (
            teachers.map(teacher => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.full_name}</td>
                <td>{teacher.phone || '-'}</td>
                <td>{teacher.birth_date || '-'}</td>
                <td>{teacher.hire_date || '-'}</td>
                {canCreateTeacher && (
                  <td>
                    {canEdit && <button onClick={() => handleEdit(teacher)}>✏️</button>}
                    {canDelete && <button className="danger" onClick={() => handleDelete(teacher.id, teacher.full_name)}>🗑️</button>}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <TeacherForm
          teacher={editingTeacher}
          onClose={() => {
            setShowForm(false)
            setEditingTeacher(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}

export default TeachersPage