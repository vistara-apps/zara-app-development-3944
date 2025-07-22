import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatDistanceToNow } from 'date-fns';

function RecentTransactions({ limit = 10 }) {
  const { transactions } = useFinance();
  
  const recentTransactions = transactions.slice(0, limit);

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

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center text-muted" style={{ padding: '40px 0' }}>
        <div style={{ fontSize: '2em', marginBottom: '10px' }}>💳</div>
        <p>No transactions yet. Add your first transaction!</p>
      </div>
    );
  }

  return (
    <div>
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div className="flex">
            <div style={{ fontSize: '1.5em', marginRight: '12px' }}>
              {getCategoryIcon(transaction.category)}
            </div>
            <div>
              <div style={{ fontWeight: '500' }}>{transaction.description}</div>
              <div className="text-muted" style={{ fontSize: '14px' }}>
                {transaction.category} • {transaction.account} • {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
              </div>
            </div>
          </div>
          <div style={{ 
            fontWeight: 'bold',
            fontSize: '1.1em',
            color: transaction.amount > 0 ? '#00b894' : '#ff6b6b'
          }}>
            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentTransactions;