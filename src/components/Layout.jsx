import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import Sidebar from './Sidebar'
import Header from './Header'
import LoadingSpinner from './LoadingSpinner'

function Layout() {
  const { user, loading: authLoading } = useAuth()
  const { loading: dataLoading } = useData()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Loading your account..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 sm:p-6">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading your financial data..." />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Layout
