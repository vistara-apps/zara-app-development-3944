import React from 'react';
import { useFinance } from '../context/FinanceContext';

function BudgetOverview() {
  const { budgets } = useFinance();

  if (budgets.length === 0) {
    return (
      <div className="text-center text-muted" style={{ padding: '40px 0' }}>
        <div style={{ fontSize: '2em', marginBottom: '10px' }}>📊</div>
        <p>No budgets created yet. Create your first budget!</p>
      </div>
    );
  }

  return (
    <div>
      {budgets.slice(0, 4).map((budget) => {
        const percentage = (budget.spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;
        
        return (
          <div key={budget.id} className="category-item">
            <div>
              <div style={{ fontWeight: '500' }}>{budget.name}</div>
              <div className="text-muted" style={{ fontSize: '14px' }}>
                ${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()}
              </div>
              <div className="progress-bar" style={{ marginTop: '8px' }}>
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    background: isOverBudget 
                      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                />
              </div>
            </div>
            <div style={{ 
              fontWeight: 'bold',
              color: isOverBudget ? '#ff6b6b' : '#00b894'
            }}>
              {percentage.toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BudgetOverview;