import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import GradeForm from '../components/GradeForm'

const GradesPage = () => {
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ student_id: '', subject_id: '' })

  const loadData = useCallback(async () => {
    try {
      const [gradesRes, studentsRes, subjectsRes] = await Promise.all([
        api.getGrades(filters),
        api.getStudents(),
        api.getSubjects()
      ])
      setGrades(gradesRes.data || [])
      setStudents(studentsRes.data || [])
      setSubjects(subjectsRes.data || [])
    } catch {
      console.error('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  if (loading) return <div className="content">Загрузка...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Журнал оценок</h2>
        <button className="success" onClick={() => setShowForm(true)}>
          ➕ Поставить оценку
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <select name="student_id" value={filters.student_id} onChange={handleFilterChange}>
          <option value="">Все ученики</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.full_name}</option>
          ))}
        </select>
        
        <select name="subject_id" value={filters.subject_id} onChange={handleFilterChange}>
          <option value="">Все предметы</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Ученик</th>
            <th>Предмет</th>
            <th>Оценка</th>
            <th>Учитель</th>
            <th>Дата</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {grades.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Нет оценок</td></tr>
          ) : (
            grades.map(grade => (
              <tr key={grade.id}>
                <td>{grade.student?.full_name}</td>
                <td>{grade.subject?.name}</td>
                <td style={{ 
                  fontWeight: 'bold',
                  color: grade.grade === 5 ? '#27ae60' : 
                         grade.grade === 4 ? '#2980b9' :
                         grade.grade === 3 ? '#f39c12' : '#e74c3c'
                }}>
                  {grade.grade}
                </td>
                <td>{grade.teacher?.full_name}</td>
                <td>{new Date(grade.date_received).toLocaleDateString()}</td>
                <td>{grade.comment || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <GradeForm
          students={students}
          subjects={subjects}
          onClose={() => {
            setShowForm(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}

export default GradesPage