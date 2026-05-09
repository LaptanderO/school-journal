import { useState } from 'react'
import api from '../services/api'

const ClassForm = ({ classObj, teachers, onClose }) => {
  const [formData, setFormData] = useState({
    name: classObj?.name || '',
    class_teacher_id: classObj?.class_teacher_id || ''
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
      const dataToSend = {
        ...formData,
        class_teacher_id: formData.class_teacher_id ? parseInt(formData.class_teacher_id) : null
      }
      
      if (classObj) {
        await api.updateClass(classObj.id, dataToSend)
      } else {
        await api.createClass(dataToSend)
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
        <h3>{classObj ? 'Редактировать класс' : 'Добавить класс'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название класса *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например: 7А"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Классный руководитель</label>
            <select
              name="class_teacher_id"
              value={formData.class_teacher_id}
              onChange={handleChange}
            >
              <option value="">Не назначен</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
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

export default ClassForm