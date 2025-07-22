import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Download, Filter, Search, Trash2, Edit } from 'lucide-react';
import TransactionModal from './TransactionModal';

function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['All', 'Income', 'Groceries', 'Entertainment', 'Transportation', 'Utilities', 'Healthcare', 'Dining', 'Shopping', 'Education', 'Insurance'];

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || transaction.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netAmount = totalIncome - totalExpenses;

  const getCategoryIcon = (category) => {
    const icons = {
      'Groceries': '🛒',
      'Entertainment': '🎬',
      'Income': '💰',
      'Transportation': '⛽',
      'Utilities': '🔌',
      'Healthcare': '🏥',
      'Dining': '🍽️',
      'Shopping': '🛍️',
      'Education': '📚',
      'Insurance': '🛡️'
    };
    return icons[category] || '💳';
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="flex-between" style={{ marginBottom: '30px' }}>
        <h1>Transactions</h1>
        <button className="btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Income</div>
          <div className="stat-value text-success">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value text-danger">${totalExpenses.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Net Amount</div>
          <div className={`stat-value ${netAmount >= 0 ? 'text-success' : 'text-danger'}`}>
            {netAmount >= 0 ? '+' : ''}${netAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="grid grid-4" style={{ alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Category</label>
            <select 
              className="form-control"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Sort By</label>
            <select 
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date (Newest First)</option>
              <option value="amount">Amount (Highest First)</option>
              <option value="category">Category</option>
            </select>
          </div>

          <button className="btn btn-secondary">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-muted" style={{ padding: '40px 0' }}>
            <div style={{ fontSize: '3em', marginBottom: '20px' }}>💳</div>
            <h3>No transactions found</h3>
            <p>Try adjusting your search criteria or add your first transaction.</p>
            <button className="btn" onClick={() => setShowModal(true)}>
              Add Your First Transaction
            </button>
          </div>
        ) : (
          <div>
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="flex">
                  <div style={{ fontSize: '1.5em', marginRight: '15px' }}>
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '16px' }}>
                      {transaction.description}
                    </div>
                    <div className="text-muted" style={{ fontSize: '14px' }}>
                      {transaction.category} • {transaction.account} • {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div style={{ 
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: transaction.amount > 0 ? '#00b894' : '#ff6b6b',
                    marginRight: '15px'
                  }}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </div>
                  
                  <div className="flex">
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#6c757d',
                        cursor: 'pointer',
                        padding: '5px',
                        marginRight: '5px'
                      }}
                      title="Edit transaction"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        padding: '5px'
                      }}
                      onClick={() => deleteTransaction(transaction.id)}
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Transactions;