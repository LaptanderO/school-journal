import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = '/api'

const DashboardPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data)
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          navigate('/login')
        }
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) return <div className="content">Загрузка...</div>
  if (!user) return null

  return (
    <div className="content">
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2>👤 Личный кабинет</h2>
            <p style={styles.role}>
              Роль: <span style={styles.badge}>{user.role === 'admin' ? '🛡️ Администратор' : '📚 Учитель'}</span>
            </p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Выйти
          </button>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <strong>Имя пользователя:</strong>
            <p>{user.username}</p>
          </div>
          
          {user.teacher ? (
            <>
              <div style={styles.infoItem}>
                <strong>Учитель:</strong>
                <p>{user.teacher.full_name}</p>
              </div>
              <div style={styles.infoItem}>
                <strong>Телефон:</strong>
                <p>{user.teacher.phone || 'Не указан'}</p>
              </div>
            </>
          ) : (
            <div style={styles.infoItem}>
              <strong>Статус:</strong>
              <p>Администратор системы</p>
            </div>
          )}

          <div style={styles.infoItem}>
            <strong>ID пользователя:</strong>
            <p>#{user.id}</p>
          </div>
        </div>

        <div style={styles.actions}>
          <h3>Быстрые действия</h3>
          <div style={styles.buttonGrid}>
            <button onClick={() => navigate('/')} style={styles.actionBtn}>
              📋 Список учеников
            </button>
            <button onClick={() => navigate('/teachers')} style={styles.actionBtn}>
              👨‍🏫 Учителя
            </button>
            <button onClick={() => navigate('/grades')} style={styles.actionBtn}>
              📊 Журнал оценок
            </button>
            <button onClick={() => navigate('/subjects')} style={styles.actionBtn}>
              📖 Предметы
            </button>
            <button onClick={() => navigate('/classes')} style={styles.actionBtn}>
              🏫 Классы
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    maxWidth: 900,
    margin: '0 auto',
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: 30,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #eee',
    paddingBottom: 20,
    marginBottom: 30,
  },
  role: {
    color: '#666',
    marginTop: 8,
  },
  badge: {
    background: '#e8f4fd',
    color: '#2196F3',
    padding: '4px 12px',
    borderRadius: 20,
    fontWeight: 600,
  },
  logoutBtn: {
    background: '#ff4757',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginBottom: 30,
  },
  infoItem: {
    padding: 15,
    background: '#f8f9fa',
    borderRadius: 8,
  },
  actions: {
    borderTop: '1px solid #eee',
    paddingTop: 20,
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10,
    marginTop: 15,
  },
  actionBtn: {
    background: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
  },
}

export default DashboardPage