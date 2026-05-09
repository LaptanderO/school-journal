import { useState, useEffect } from 'react'
import api from '../services/api'

const GradeForm = ({ students, subjects, onClose }) => {
  const [teachers, setTeachers] = useState([])
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    teacher_id: '',
    grade: '5',
    comment: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getTeachers().then(res => setTeachers(res.data || []))
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.createGrade({
        ...formData,
        grade: parseInt(formData.grade),
        date_received: new Date().toISOString().split('T')[0]
      })
      onClose()
    } catch  {
      alert('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Поставить оценку</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ученик *</label>
            <select name="student_id" value={formData.student_id} onChange={handleChange} required>
              <option value="">Выберите ученика</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Предмет *</label>
            <select name="subject_id" value={formData.subject_id} onChange={handleChange} required>
              <option value="">Выберите предмет</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Учитель *</label>
            <select name="teacher_id" value={formData.teacher_id} onChange={handleChange} required>
              <option value="">Выберите учителя</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Оценка *</label>
            <select name="grade" value={formData.grade} onChange={handleChange} required>
              <option value="5">5 (отлично)</option>
              <option value="4">4 (хорошо)</option>
              <option value="3">3 (удовлетворительно)</option>
              <option value="2">2 (неудовлетворительно)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Комментарий</label>
            <input
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Например: За контрольную"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" className="success" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GradeForm