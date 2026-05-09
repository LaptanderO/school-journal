import { useState } from 'react'
import api from '../services/api'

const StudentForm = ({ student, classes, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: student?.full_name || '',
    birth_date: student?.birth_date || '',
    address: student?.address || '',
    class_id: student?.class_id || ''
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
      if (student) {
        await api.updateStudent(student.id, formData)
      } else {
        await api.createStudent(formData)
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
        <h3>{student ? 'Редактировать ученика' : 'Добавить ученика'}</h3>
        
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
            <label>Дата рождения</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Адрес</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Класс</label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
            >
              <option value="">Не выбран</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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

export default StudentForm