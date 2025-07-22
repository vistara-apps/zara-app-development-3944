import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';

function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    income: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate authentication
    const userData = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      income: isLogin ? 50000 : parseFloat(formData.income) || 50000,
      net_worth: 25000,
      isPremium: false
    };

    onLogin(userData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>
                <User size={16} style={{ marginRight: '8px' }} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <Mail size={16} style={{ marginRight: '8px' }} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} style={{ marginRight: '8px' }} />
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Annual Income (Optional)</label>
              <input
                type="number"
                name="income"
                className="form-control"
                value={formData.income}
                onChange={handleInputChange}
                placeholder="Enter your annual income"
              />
            </div>
          )}

          <button type="submit" className="btn" style={{ width: '100%', marginBottom: '15px' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#667eea', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>

        {!isLogin && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              Start with our free plan and upgrade to Premium for $9.99/month to unlock advanced features.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;