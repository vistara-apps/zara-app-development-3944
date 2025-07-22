import React, { createContext, useContext } from 'react'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/Toast'

const ToastContext = createContext()

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const toastMethods = useToast()

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer 
        toasts={toastMethods.toasts} 
        onClose={toastMethods.removeToast}
        position="top-right"
      />
    </ToastContext.Provider>
  )
}

