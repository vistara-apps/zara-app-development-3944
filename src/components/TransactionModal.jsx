import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, CreditCard } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

function TransactionModal({ onClose, transaction = null }) {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    amount: transaction?.amount || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    category: transaction?.category || 'Groceries',
    description: transaction?.description || '',
    account: transaction?.account || 'Checking'
  });

  const categories = [
    'Income', 'Groceries', 'Entertainment', 'Transportation', 'Utilities', 
    'Healthcare', 'Dining', 'Shopping', 'Education', 'Insurance'
  ];

  const accounts = ['Checking', 'Savings', 'Credit Card', 'Debit Card', 'Cash'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    addTransaction(transactionData);
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
          <h2>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
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
              <DollarSign size={16} style={{ marginRight: '8px' }} />
              Amount
            </label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleInputChange}
              required
              step="0.01"
              placeholder="Enter amount (use negative for expenses)"
            />
            <p className="text-muted" style={{ fontSize: '12px', marginTop: '5px' }}>
              Use negative values for expenses (e.g., -50.00) and positive for income (e.g., 3000.00)
            </p>
          </div>

          <div className="form-group">
            <label>
              <Calendar size={16} style={{ marginRight: '8px' }} />
              Date
            </label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Tag size={16} style={{ marginRight: '8px' }} />
              Category
            </label>
            <select 
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <FileText size={16} style={{ marginRight: '8px' }} />
              Description
            </label>
            <input
              type="text"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter transaction description"
            />
          </div>

          <div className="form-group">
            <label>
              <CreditCard size={16} style={{ marginRight: '8px' }} />
              Account
            </label>
            <select 
              name="account"
              className="form-control"
              value={formData.account}
              onChange={handleInputChange}
              required
            >
              {accounts.map(account => (
                <option key={account} value={account}>{account}</option>
              ))}
            </select>
          </div>

          <div className="flex" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;