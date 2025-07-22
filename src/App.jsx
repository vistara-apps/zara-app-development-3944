import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Investments from './pages/Investments'
import Goals from './pages/Goals'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="investments" element={<Investments />} />
                <Route path="goals" element={<Goals />} />
              </Route>
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
