import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
    toast.success(`Welcome back, ${data.user.name}!`)
    return data.user
  }

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    setUser(data.user)
    toast.success('Account created successfully!')
    return data.user
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updatedUser) => setUser(updatedUser)

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
