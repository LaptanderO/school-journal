import { useState } from 'react'
import api from '../services/api'

const SubjectForm = ({ subject, onClose }) => {
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    description: subject?.description || ''
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
      if (subject) {
        await api.updateSubject(subject.id, formData)
      } else {
        await api.createSubject(formData)
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
        <h3>{subject ? 'Редактировать предмет' : 'Добавить предмет'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              style={{ width: '100%', padding: '8px' }}
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

export default SubjectForm