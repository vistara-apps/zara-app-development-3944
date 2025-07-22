import React, { useState } from 'react';
import { X, DollarSign, Calendar, TrendingUp, FileText } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

function InvestmentModal({ onClose, investment = null }) {
  const { addInvestment } = useFinance();
  const [formData, setFormData] = useState({
    name: investment?.name || '',
    type: investment?.type || 'Stock',
    amount: investment?.amount || '',
    current_value: investment?.current_value || '',
    purchase_date: investment?.purchase_date || new Date().toISOString().split('T')[0]
  });

  const investmentTypes = [
    'Stock', 'ETF', 'Bond', 'Mutual Fund', 'Cryptocurrency', 'Real Estate', 'Commodity'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const investmentData = {
      ...formData,
      amount: parseFloat(formData.amount),
      current_value: formData.current_value ? parseFloat(formData.current_value) : parseFloat(formData.amount)
    };

    addInvestment(investmentData);
    onClose();
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
          <h2>{investment ? 'Edit Investment' : 'Add New Investment'}</h2>
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
              <FileText size={16} style={{ marginRight: '8px' }} />
              Investment Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Apple Inc., Vanguard S&P 500 ETF"
            />
          </div>

          <div className="form-group">
            <label>
              <TrendingUp size={16} style={{ marginRight: '8px' }} />
              Investment Type
            </label>
            <select 
              name="type"
              className="form-control"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              {investmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>
                <DollarSign size={16} style={{ marginRight: '8px' }} />
                Initial Investment Amount
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
                placeholder="Enter initial amount"
              />
            </div>

            <div className="form-group">
              <label>
                <DollarSign size={16} style={{ marginRight: '8px' }} />
                Current Value (Optional)
              </label>
              <input
                type="number"
                name="current_value"
                className="form-control"
                value={formData.current_value}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                placeholder="Leave empty to use initial amount"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Calendar size={16} style={{ marginRight: '8px' }} />
              Purchase Date
            </label>
            <input
              type="date"
              name="purchase_date"
              className="form-control"
              value={formData.purchase_date}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>🚀 Investment Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#6c757d' }}>
              <li>Diversify your portfolio across different asset types</li>
              <li>Consider dollar-cost averaging for regular investments</li>
              <li>Review and rebalance your portfolio quarterly</li>
              <li>Keep track of fees and expenses</li>
              <li>Stay informed but avoid emotional trading decisions</li>
            </ul>
          </div>

          <div className="flex" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              {investment ? 'Update' : 'Add'} Investment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvestmentModal;