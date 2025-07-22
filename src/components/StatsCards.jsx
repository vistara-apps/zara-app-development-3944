import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

function StatsCards() {
  const { transactions, investments, goals } = useFinance();

  // Calculate monthly income and expenses
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netWorth = monthlyIncome - monthlyExpenses + 
    investments.reduce((sum, inv) => sum + inv.current_value, 0);

  const totalGoalProgress = goals.reduce((sum, goal) => 
    sum + (goal.current_amount / goal.target_amount) * 100, 0) / goals.length || 0;

  const stats = [
    {
      label: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: '#00b894',
      change: '+8.2%'
    },
    {
      label: 'Monthly Expenses',
      value: `$${monthlyExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: '#ff6b6b',
      change: '-3.1%'
    },
    {
      label: 'Net Worth',
      value: `$${netWorth.toLocaleString()}`,
      icon: Wallet,
      color: '#667eea',
      change: '+12.5%'
    },
    {
      label: 'Goal Progress',
      value: `${totalGoalProgress.toFixed(1)}%`,
      icon: Target,
      color: '#764ba2',
      change: '+5.0%'
    }
  ];

  return (
    <div className="grid grid-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="flex-between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-success" style={{ fontSize: '12px', marginTop: '5px' }}>
                  {stat.change} from last month
                </div>
              </div>
              <div style={{
                background: stat.color,
                borderRadius: '50%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} color="white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;