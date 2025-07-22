import React, { useState } from 'react';
import { X, Target, DollarSign, Calendar, Flag } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

function GoalModal({ onClose, goal = null }) {
  const { addGoal } = useFinance();
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    target_amount: goal?.target_amount || '',
    current_amount: goal?.current_amount || 0,
    target_date: goal?.target_date || '',
    priority: goal?.priority || 'Medium'
  });

  const goalTemplates = [
    { name: 'Emergency Fund', amount: 10000, priority: 'High', description: '3-6 months of expenses' },
    { name: 'House Down Payment', amount: 50000, priority: 'High', description: '20% down payment' },
    { name: 'Vacation Fund', amount: 5000, priority: 'Medium', description: 'Dream vacation savings' },
    { name: 'Car Purchase', amount: 25000, priority: 'Medium', description: 'New vehicle fund' },
    { name: 'Retirement Boost', amount: 100000, priority: 'High', description: 'Additional retirement savings' },
    { name: 'Education Fund', amount: 30000, priority: 'Medium', description: 'College or certification' }
  ];

  const priorities = ['Low', 'Medium', 'High'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const goalData = {
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount) || 0
    };

    addGoal(goalData);
    onClose();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTemplateSelect = (template) => {
    setFormData({
      ...formData,
      name: template.name,
      target_amount: template.amount,
      priority: template.priority
    });
  };

  const calculateMonthsToGoal = () => {
    if (!formData.target_date) return 0;
    const today = new Date();
    const target = new Date(formData.target_date);
    const diffTime = target - today;
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  const monthlyRequired = () => {
    const months = calculateMonthsToGoal();
    const remaining = parseFloat(formData.target_amount) - parseFloat(formData.current_amount || 0);
    return months > 0 ? remaining / months : 0;
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h2>{goal ? 'Edit Goal' : 'Create New Financial Goal'}</h2>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Goal Templates */}
        {!goal && (
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ marginBottom: '15px' }}>🚀 Quick Start Templates</h4>
            <div className="grid grid-3" style={{ gap: '10px' }}>
              {goalTemplates.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  style={{
                    background: formData.name === template.name ? '#667eea' : '#f8f9fa',
                    color: formData.name === template.name ? 'white' : '#333',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{template.name}</div>
                  <div style={{ opacity: 0.8 }}>${template.amount.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <Target size={16} style={{ marginRight: '8px' }} />
              Goal Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your financial goal"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <DollarSign size={16} style={{ marginRight: '8px' }} />
                Target Amount
              </label>
              <input
                type="number"
                name="target_amount"
                className="form-control"
                value={formData.target_amount}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                placeholder="Enter target amount"
              />
            </div>

            <div className="form-group">
              <label>
                <DollarSign size={16} style={{ marginRight: '8px' }} />
                Current Amount
              </label>
              <input
                type="number"
                name="current_amount"
                className="form-control"
                value={formData.current_amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                placeholder="Current savings (optional)"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <Calendar size={16} style={{ marginRight: '8px' }} />
                Target Date
              </label>
              <input
                type="date"
                name="target_date"
                className="form-control"
                value={formData.target_date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>
                <Flag size={16} style={{ marginRight: '8px' }} />
                Priority
              </label>
              <select 
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Goal Calculation Preview */}
          {formData.target_date && formData.target_amount && (
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <h4 style={{ marginBottom: '10px', fontSize: '16px', color: '#667eea' }}>
                📊 Goal Analysis
              </h4>
              <div className="grid grid-2">
                <div>
                  <div className="text-muted" style={{ fontSize: '14px' }}>Months to Goal</div>
                  <div style={{ fontWeight: 'bold' }}>{calculateMonthsToGoal()} months</div>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: '14px' }}>Monthly Savings Needed</div>
                  <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                    ${monthlyRequired().toFixed(2)}/month
                  </div>
                </div>
              </div>
              {monthlyRequired() > 1000 && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#fdcb6e' }}>
                  ⚠️ This requires significant monthly savings. Consider adjusting your target date or amount.
                </div>
              )}
            </div>
          )}

          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>💡 Goal Setting Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#6c757d' }}>
              <li>Make your goals SMART: Specific, Measurable, Achievable, Relevant, Time-bound</li>
              <li>Start with an emergency fund covering 3-6 months of expenses</li>
              <li>Break large goals into smaller milestones for motivation</li>
              <li>Automate savings to make consistent progress</li>
              <li>Review and adjust goals quarterly as circumstances change</li>
            </ul>
          </div>

          <div className="flex" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              {goal ? 'Update' : 'Create'} Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalModal;