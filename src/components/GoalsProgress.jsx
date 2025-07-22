import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatDistanceToNow } from 'date-fns';

function GoalsProgress({ limit = 10 }) {
  const { goals } = useFinance();
  
  const displayGoals = goals.slice(0, limit);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ff6b6b';
      case 'Medium': return '#fdcb6e';
      case 'Low': return '#00b894';
      default: return '#6c757d';
    }
  };

  if (displayGoals.length === 0) {
    return (
      <div className="text-center text-muted" style={{ padding: '40px 0' }}>
        <div style={{ fontSize: '2em', marginBottom: '10px' }}>🎯</div>
        <p>No financial goals set yet. Create your first goal!</p>
      </div>
    );
  }

  return (
    <div>
      {displayGoals.map((goal) => {
        const percentage = (goal.current_amount / goal.target_amount) * 100;
        const daysUntilTarget = Math.ceil(
          (new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24)
        );
        
        return (
          <div key={goal.id} className="category-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="flex-between" style={{ width: '100%', marginBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: '500' }}>{goal.name}</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>
                  ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  background: getPriorityColor(goal.priority),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {goal.priority}
                </div>
                <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                  {daysUntilTarget > 0 ? `${daysUntilTarget} days left` : 'Overdue'}
                </div>
              </div>
            </div>
            
            <div style={{ width: '100%' }}>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    background: percentage >= 100 
                      ? 'linear-gradient(135deg, #00b894 0%, #00a085 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                />
              </div>
              <div style={{ 
                textAlign: 'center', 
                marginTop: '8px',
                fontWeight: 'bold',
                color: percentage >= 100 ? '#00b894' : '#667eea'
              }}>
                {percentage.toFixed(1)}% Complete
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GoalsProgress;