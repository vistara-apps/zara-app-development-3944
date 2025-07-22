import React, { createContext, useContext, useState, useEffect } from 'react'
import { userStorage } from '../utils/storage'
import { validators, combineValidators } from '../utils/validation'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check for stored user data with error handling
    try {
      const storedUser = userStorage.get()
      if (storedUser) {
        setUser(storedUser)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    setError(null)
    
    // Validate inputs
    const emailError = combineValidators(validators.required, validators.email)(email)
    const passwordError = validators.required(password)
    
    if (emailError || passwordError) {
      throw new Error(emailError || passwordError)
    }

    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate authentication check
    if (email === 'demo@finanza.com' || email.includes('@')) {
      const userData = {
        id: Date.now(),
        name: email === 'demo@finanza.com' ? 'Demo User' : email.split('@')[0],
        email,
        income: 75000,
        net_worth: 125000,
        avatar: null,
        preferences: {
          currency: 'USD',
          theme: 'light',
          notifications: true
        },
        lastLogin: new Date().toISOString()
      }
      
      setUser(userData)
      userStorage.set(userData)
      return userData
    } else {
      throw new Error('Invalid email or password')
    }
  }

  const register = async (name, email, password) => {
    setError(null)
    
    // Validate inputs
    const nameError = validators.required(name)
    const emailError = combineValidators(validators.required, validators.email)(email)
    const passwordError = combineValidators(
      validators.required, 
      validators.passwordStrength
    )(password)
    
    if (nameError || emailError || passwordError) {
      throw new Error(nameError || emailError || passwordError)
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const userData = {
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase(),
      income: 0,
      net_worth: 0,
      avatar: null,
      preferences: {
        currency: 'USD',
        theme: 'light',
        notifications: true
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    setUser(userData)
    userStorage.set(userData)
    return userData
  }

  const logout = () => {
    setUser(null)
    setError(null)
    userStorage.remove()
    
    // Clear other sensitive data
    // Note: We keep non-sensitive data like transactions for demo purposes
  }

  const updateProfile = async (updates) => {
    if (!user) {
      throw new Error('No user logged in')
    }

    setError(null)
    
    // Validate updates
    if (updates.email) {
      const emailError = validators.email(updates.email)
      if (emailError) {
        throw new Error(emailError)
      }
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    setUser(updatedUser)
    userStorage.set(updatedUser)
    return updatedUser
  }

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) {
      throw new Error('No user logged in')
    }

    setError(null)
    
    // Validate new password
    const passwordError = combineValidators(
      validators.required,
      validators.passwordStrength
    )(newPassword)
    
    if (passwordError) {
      throw new Error(passwordError)
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // In a real app, you would verify the current password
    // For demo purposes, we'll just simulate success
    return true
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loading,
    error,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
