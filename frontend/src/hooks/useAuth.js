import { useState, useEffect } from 'react'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  const isAuthenticated = !!user

  const canEdit = isAdmin || isTeacher
  const canDelete = isAdmin
  const canCreateTeacher = isAdmin
  const canCreateSubject = isAdmin
  const canCreateClass = isAdmin

  return {
    user,
    loading,
    isAdmin,
    isTeacher,
    isAuthenticated,
    canEdit,
    canDelete,
    canCreateTeacher,
    canCreateSubject,
    canCreateClass
  }
}

export default useAuth