import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Investments from './components/Investments';
import Goals from './components/Goals';
import AuthModal from './components/AuthModal';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in (simulate local storage check)
    const savedUser = localStorage.getItem('finanza_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('finanza_user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('finanza_user');
  };

  if (!user) {
    return (
      <>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header 
            user={user} 
            onLogin={() => setShowAuthModal(true)} 
            onLogout={handleLogout}
          />
          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container text-center">
              <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3em', marginBottom: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Finanza
                </h1>
                <p style={{ fontSize: '1.2em', marginBottom: '30px', color: '#6c757d' }}>
                  Take control of your money with intelligent expense tracking, budgeting, and goal planning.
                </p>
                <div className="grid grid-2" style={{ marginBottom: '30px' }}>
                  <div>
                    <h3 style={{ color: '#667eea', marginBottom: '10px' }}>📊 Smart Tracking</h3>
                    <p className="text-muted">Automatically categorize and visualize your spending patterns</p>
                  </div>
                  <div>
                    <h3 style={{ color: '#667eea', marginBottom: '10px' }}>💰 Budget Planning</h3>
                    <p className="text-muted">Create personalized budgets with intelligent suggestions</p>
                  </div>
                  <div>
                    <h3 style={{ color: '#667eea', marginBottom: '10px' }}>📈 Investment Tracking</h3>
                    <p className="text-muted">Monitor your portfolio performance across multiple accounts</p>
                  </div>
                  <div>
                    <h3 style={{ color: '#667eea', marginBottom: '10px' }}>🎯 Goal Achievement</h3>
                    <p className="text-muted">Track progress towards your financial milestones</p>
                  </div>
                </div>
                <button className="btn" onClick={() => setShowAuthModal(true)}>
                  Get Started - It's Free!
                </button>
                <p className="text-muted" style={{ marginTop: '15px' }}>
                  Premium features available for $9.99/month
                </p>
              </div>
            </div>
          </main>
        </div>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}
      </>
    );
  }

  return (
    <FinanceProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header 
            user={user} 
            onLogin={() => setShowAuthModal(true)} 
            onLogout={handleLogout}
          />
          <main style={{ flex: 1 }}>
            <div className="container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;