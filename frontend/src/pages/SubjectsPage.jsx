import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import SubjectForm from '../components/SubjectForm'
import useAuth from '../hooks/useAuth'

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)

  const { canCreateSubject, canDelete, canEdit } = useAuth()

  const loadData = useCallback(async () => {
    try {
      const res = await api.getSubjects()
      setSubjects(res.data || [])
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
    if (window.confirm(`Удалить предмет "${name}"?`)) {
      try {
        await api.deleteSubject(id)
        loadData()
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingSubject(null)
    setShowForm(true)
  }

  if (loading) return <div className="content">Загрузка...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Предметы</h2>
        {canCreateSubject && (
          <button className="success" onClick={handleAdd}>
            ➕ Добавить предмет
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Нет предметов</td></tr>
          ) : (
            subjects.map(subject => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td>{subject.description || '-'}</td>
                {canCreateSubject && (
                  <td>
                    {canEdit && <button onClick={() => handleEdit(subject)}>✏️</button>}
                    {canDelete && <button className="danger" onClick={() => handleDelete(subject.id, subject.name)}>🗑️</button>}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <SubjectForm
          subject={editingSubject}
          onClose={() => {
            setShowForm(false)
            setEditingSubject(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}

export default SubjectsPage