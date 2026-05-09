import { useState } from 'react'
import api from '../services/api'

const TeacherForm = ({ teacher, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: teacher?.full_name || '',
    birth_date: teacher?.birth_date || '',
    phone: teacher?.phone || '',
    hire_date: teacher?.hire_date || ''
  })
  const [saving, setSaving] = useState(false)

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
      if (teacher) {
        await api.updateTeacher(teacher.id, formData)
      } else {
        await api.createTeacher(formData)
      }
      onClose()
    } catch {
      alert('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{teacher ? 'Редактировать учителя' : 'Добавить учителя'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ФИО *</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Телефон</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+79001234567"
            />
          </div>
          
          <div className="form-group">
            <label>Дата рождения</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Дата приёма на работу</label>
            <input
              type="date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleChange}
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

export default TeacherForm