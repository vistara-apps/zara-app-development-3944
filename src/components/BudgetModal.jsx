import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

function BudgetModal({ onClose, budget = null }) {
  const { addBudget } = useFinance();
  const [formData, setFormData] = useState({
    name: budget?.name || '',
    amount: budget?.amount || '',
    start_date: budget?.start_date || new Date().toISOString().split('T')[0],
    end_date: budget?.end_date || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  });

  const budgetCategories = [
    'Groceries', 'Entertainment', 'Transportation', 'Utilities', 
    'Healthcare', 'Dining', 'Shopping', 'Education', 'Insurance',
    'Rent/Mortgage', 'Travel', 'Hobbies', 'Clothing', 'Personal Care'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    addBudget(budgetData);
    onClose();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuickSelect = (category) => {
    setFormData({
      ...formData,
      name: category
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h2>{budget ? 'Edit Budget' : 'Create New Budget'}</h2>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <Tag size={16} style={{ marginRight: '8px' }} />
              Budget Name/Category
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter budget name or select category below"
            />
            
            <div style={{ marginTop: '10px' }}>
              <p className="text-muted" style={{ fontSize: '14px', marginBottom: '8px' }}>Quick select:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {budgetCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    style={{
                      background: formData.name === category ? '#667eea' : '#f8f9fa',
                      color: formData.name === category ? 'white' : '#333',
                      border: '1px solid #dee2e6',
                      borderRadius: '15px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleQuickSelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>
              <DollarSign size={16} style={{ marginRight: '8px' }} />
              Budget Amount
            </label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
              placeholder="Enter budget amount"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <Calendar size={16} style={{ marginRight: '8px' }} />
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={16} style={{ marginRight: '8px' }} />
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                className="form-control"
                value={formData.end_date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>💡 Budget Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#6c757d' }}>
              <li>Set realistic amounts based on your past spending</li>
              <li>Review and adjust budgets monthly</li>
              <li>Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
              <li>Track spending regularly to stay within limits</li>
            </ul>
          </div>

          <div className="flex" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              {budget ? 'Update' : 'Create'} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;