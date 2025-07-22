import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Home, CreditCard, PieChart, TrendingUp, Target, Menu, X } from 'lucide-react';

function Header({ user, onLogin, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Investments', href: '/investments', icon: TrendingUp },
    { name: 'Goals', href: '/goals', icon: Target },
  ];

  return (
    <header style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container">
        <div className="flex-between" style={{ padding: '15px 0' }}>
          <div className="flex">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ 
                fontSize: '1.5em', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Finanza
              </h1>
            </Link>
          </div>

          {user && (
            <>
              <nav className="flex" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      style={{
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                        color: isActive ? '#667eea' : '#333',
                        transition: 'all 0.3s ease'
                      }}
                      className="flex"
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                style={{ 
                  display: window.innerWidth <= 768 ? 'block' : 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}

          <div className="flex">
            {user && <ConnectButton />}
            {user ? (
              <div className="flex">
                <span style={{ marginRight: '15px', color: '#667eea', fontWeight: '500' }}>
                  Welcome, {user.name}!
                </span>
                <button className="btn btn-secondary" onClick={onLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="btn" onClick={onLogin}>
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && mobileMenuOpen && (
          <nav style={{ 
            display: 'block',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            paddingTop: '15px',
            marginBottom: '15px'
          }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    textDecoration: 'none',
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: isActive ? '#667eea' : '#333',
                    fontWeight: isActive ? '500' : 'normal'
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;