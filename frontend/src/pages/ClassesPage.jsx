import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import ClassForm from '../components/ClassForm'
import useAuth from '../hooks/useAuth'

const ClassesPage = () => {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)

  const { canCreateClass, canDelete, canEdit } = useAuth()

  const loadData = useCallback(async () => {
    try {
      const [classesRes, teachersRes] = await Promise.all([
        api.getClasses(),
        api.getTeachers()
      ])
      setClasses(classesRes.data || [])
      setTeachers(teachersRes.data || [])
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
    if (window.confirm(`Удалить класс "${name}"?`)) {
      try {
        await api.deleteClass(id)
        loadData()
      } catch {
        alert('Ошибка при удалении')
      }
    }
  }

  const handleEdit = (classObj) => {
    setEditingClass(classObj)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingClass(null)
    setShowForm(true)
  }

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId)
    return teacher?.full_name || '-'
  }

  if (loading) return <div className="content">Загрузка...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Классы</h2>
        {canCreateClass && (
          <button className="success" onClick={handleAdd}>
            ➕ Добавить класс
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Классный руководитель</th>
            <th>Количество учеников</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Нет классов</td></tr>
          ) : (
            classes.map(classObj => (
              <tr key={classObj.id}>
                <td>{classObj.id}</td>
                <td>{classObj.name}</td>
                <td>{getTeacherName(classObj.class_teacher_id)}</td>
                <td>{classObj.students?.length || 0}</td>
                {canCreateClass && (
                  <td>
                    {canEdit && <button onClick={() => handleEdit(classObj)}>✏️</button>}
                    {canDelete && <button className="danger" onClick={() => handleDelete(classObj.id, classObj.name)}>🗑️</button>}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <ClassForm
          classObj={editingClass}
          teachers={teachers}
          onClose={() => {
            setShowForm(false)
            setEditingClass(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}

export default ClassesPage