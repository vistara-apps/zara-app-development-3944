import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import BudgetModal from './BudgetModal';

function Budgets() {
  const { budgets, deleteBudget } = useFinance();
  const [showModal, setShowModal] = useState(false);

  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'over':
        return <AlertTriangle size={20} color="#ff6b6b" />;
      case 'warning':
        return <TrendingDown size={20} color="#fdcb6e" />;
      case 'good':
        return <CheckCircle size={20} color="#00b894" />;
      default:
        return null;
    }
  };

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const budgetsOver = budgets.filter(budget => getBudgetStatus(budget) === 'over').length;

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="flex-between" style={{ marginBottom: '30px' }}>
        <h1>Budgets</h1>
        <button className="btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Create Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Budgeted</div>
          <div className="stat-value">${totalBudgeted.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value text-danger">${totalSpent.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Budgets Over Limit</div>
          <div className={`stat-value ${budgetsOver > 0 ? 'text-danger' : 'text-success'}`}>
            {budgetsOver}
          </div>
        </div>
      </div>

      {/* Budgets List */}
      <div className="grid grid-2">
        {budgets.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="text-center text-muted" style={{ padding: '40px 0' }}>
              <div style={{ fontSize: '3em', marginBottom: '20px' }}>📊</div>
              <h3>No budgets created yet</h3>
              <p>Create your first budget to start tracking your spending goals.</p>
              <button className="btn" onClick={() => setShowModal(true)}>
                Create Your First Budget
              </button>
            </div>
          </div>
        ) : (
          budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100;
            const status = getBudgetStatus(budget);
            const remaining = budget.amount - budget.spent;

            return (
              <div key={budget.id} className="card">
                <div className="flex-between" style={{ marginBottom: '15px' }}>
                  <h3>{budget.name}</h3>
                  <div className="flex">
                    {getStatusIcon(status)}
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        marginLeft: '10px'
                      }}
                      onClick={() => deleteBudget(budget.id)}
                      title="Delete budget"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span className="text-muted">Spent</span>
                    <span style={{ fontWeight: 'bold' }}>
                      ${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                        background: status === 'over' 
                          ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                          : status === 'warning'
                          ? 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                  </div>

                  <div className="flex-between" style={{ marginTop: '8px', fontSize: '14px' }}>
                    <span className={percentage >= 100 ? 'text-danger' : 'text-success'}>
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className={remaining >= 0 ? 'text-success' : 'text-danger'}>
                      ${Math.abs(remaining).toLocaleString()} {remaining >= 0 ? 'remaining' : 'over budget'}
                    </span>
                  </div>
                </div>

                <div className="text-muted" style={{ fontSize: '14px' }}>
                  <div>Period: {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}</div>
                  {status === 'over' && (
                    <div style={{ color: '#ff6b6b', fontWeight: 'bold', marginTop: '8px' }}>
                      ⚠️ Over budget! Consider adjusting your spending.
                    </div>
                  )}
                  {status === 'warning' && (
                    <div style={{ color: '#fdcb6e', fontWeight: 'bold', marginTop: '8px' }}>
                      ⚡ Close to budget limit. Monitor spending closely.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <BudgetModal 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Budgets;