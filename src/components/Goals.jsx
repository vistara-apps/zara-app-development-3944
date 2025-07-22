import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Target, Calendar, DollarSign } from 'lucide-react';
import GoalModal from './GoalModal';
import { usePaymentContext } from '../hooks/usePaymentContext';

function Goals() {
  const { goals, deleteGoal, updateGoalProgress } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { createSession } = usePaymentContext();
  const [paid, setPaid] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ff6b6b';
      case 'Medium': return '#fdcb6e';
      case 'Low': return '#00b894';
      default: return '#6c757d';
    }
  };

  const getDaysUntilTarget = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (goal) => {
    const percentage = (goal.current_amount / goal.target_amount) * 100;
    const daysLeft = getDaysUntilTarget(goal.target_date);
    
    if (percentage >= 100) return 'completed';
    if (daysLeft <= 0) return 'overdue';
    if (daysLeft <= 30) return 'urgent';
    return 'on-track';
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => (g.current_amount / g.target_amount) * 100 >= 100).length;
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.current_amount, 0);

  const handleAddContribution = (goalId) => {
    const amount = parseFloat(prompt('Enter contribution amount:'));
    if (amount && amount > 0) {
      updateGoalProgress(goalId, amount);
    }
  };

  const handlePremiumFeature = async () => {
    try {
      await createSession();
      setPaid(true);
      setShowPremiumModal(false);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="flex-between" style={{ marginBottom: '30px' }}>
        <h1>Financial Goals</h1>
        <button className="btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Create Goal
        </button>
      </div>

      {/* Goals Summary */}
      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Goals</div>
          <div className="stat-value">{totalGoals}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed Goals</div>
          <div className="stat-value text-success">{completedGoals}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Target</div>
          <div className="stat-value">${totalTargetAmount.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Saved</div>
          <div className="stat-value text-success">${totalCurrentAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* Advanced Goal Analytics (Premium Feature) */}
      {!paid && (
        <div className="card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>🌟 Premium Goal Analytics</h3>
          <p style={{ marginBottom: '20px', opacity: 0.9 }}>
            Unlock advanced goal tracking features including automatic savings recommendations, 
            goal achievement probability calculations, and personalized financial coaching insights.
          </p>
          <button 
            className="btn" 
            style={{ background: 'white', color: '#667eea' }}
            onClick={handlePremiumFeature}
          >
            Upgrade to Premium - $9.99/month
          </button>
        </div>
      )}

      {paid && (
        <div className="card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)', color: 'white' }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>🎉 Premium Features Unlocked!</h3>
          <div className="grid grid-3">
            <div>
              <h4 style={{ color: 'white' }}>Smart Savings Rate</h4>
              <p style={{ opacity: 0.9, margin: 0 }}>Based on your income and expenses, save $650/month to reach your goals faster.</p>
            </div>
            <div>
              <h4 style={{ color: 'white' }}>Goal Success Probability</h4>
              <p style={{ opacity: 0.9, margin: 0 }}>85% chance of reaching all goals if you maintain current savings rate.</p>
            </div>
            <div>
              <h4 style={{ color: 'white' }}>AI Coach Insight</h4>
              <p style={{ opacity: 0.9, margin: 0 }}>Consider increasing your emergency fund priority to reduce financial risk.</p>
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="grid grid-2">
        {goals.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="text-center text-muted" style={{ padding: '40px 0' }}>
              <div style={{ fontSize: '3em', marginBottom: '20px' }}>🎯</div>
              <h3>No financial goals set yet</h3>
              <p>Create your first financial goal to start tracking your progress toward financial freedom.</p>
              <button className="btn" onClick={() => setShowModal(true)}>
                Set Your First Goal
              </button>
            </div>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = (goal.current_amount / goal.target_amount) * 100;
            const daysLeft = getDaysUntilTarget(goal.target_date);
            const status = getGoalStatus(goal);
            const monthlyRequired = daysLeft > 0 ? (goal.target_amount - goal.current_amount) / (daysLeft / 30) : 0;

            return (
              <div key={goal.id} className="card">
                <div className="flex-between" style={{ marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ marginBottom: '5px' }}>{goal.name}</h3>
                    <div style={{
                      display: 'inline-block',
                      background: getPriorityColor(goal.priority),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {goal.priority} Priority
                    </div>
                  </div>
                  <div className="flex">
                    <button 
                      className="btn btn-success"
                      style={{ marginRight: '10px', padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleAddContribution(goal.id)}
                    >
                      + Add Money
                    </button>
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#ff6b6b',
                        cursor: 'pointer'
                      }}
                      onClick={() => deleteGoal(goal.id)}
                      title="Delete goal"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="grid grid-2" style={{ marginBottom: '20px' }}>
                  <div>
                    <div className="text-muted" style={{ fontSize: '14px' }}>Current Amount</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00b894' }}>
                      ${goal.current_amount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '14px' }}>Target Amount</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      ${goal.target_amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span className="text-muted">Progress</span>
                    <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                      {percentage.toFixed(1)}% Complete
                    </span>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                        background: status === 'completed' 
                          ? 'linear-gradient(135deg, #00b894 0%, #00a085 100%)'
                          : status === 'overdue'
                          ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                          : status === 'urgent'
                          ? 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-2" style={{ marginBottom: '15px', fontSize: '14px' }}>
                  <div>
                    <div className="text-muted">Target Date</div>
                    <div className="flex" style={{ alignItems: 'center' }}>
                      <Calendar size={14} style={{ marginRight: '4px' }} />
                      {new Date(goal.target_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted">Days Left</div>
                    <div className={daysLeft <= 30 ? 'text-danger' : daysLeft <= 90 ? 'text-warning' : 'text-success'}>
                      {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                    </div>
                  </div>
                </div>

                {status !== 'completed' && monthlyRequired > 0 && (
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <div className="text-muted">Monthly savings needed:</div>
                    <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                      ${monthlyRequired.toFixed(2)}/month
                    </div>
                  </div>
                )}

                {status === 'completed' && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
                    color: 'white',
                    padding: '12px', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    🎉 Goal Completed! Congratulations!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <GoalModal 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Goals;