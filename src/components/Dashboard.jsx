import React from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import StatsCards from './StatsCards';
import RecentTransactions from './RecentTransactions';
import BudgetOverview from './BudgetOverview';
import GoalsProgress from './GoalsProgress';
import { TrendingUp, CreditCard, PieChart, Target } from 'lucide-react';

function Dashboard() {
  const { transactions } = useFinance();

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="flex-between" style={{ marginBottom: '30px' }}>
        <h1>Dashboard</h1>
        <p className="text-muted">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-2" style={{ marginTop: '30px' }}>
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h3>Recent Transactions</h3>
            <Link to="/transactions" style={{ color: '#667eea', textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          <RecentTransactions limit={5} />
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h3>Budget Overview</h3>
            <Link to="/budgets" style={{ color: '#667eea', textDecoration: 'none' }}>
              Manage Budgets
            </Link>
          </div>
          <BudgetOverview />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '30px' }}>
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h3>Investment Performance</h3>
            <Link to="/investments" style={{ color: '#667eea', textDecoration: 'none' }}>
              View Portfolio
            </Link>
          </div>
          <InvestmentSummary />
        </div>

        <div className="card">
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h3>Goal Progress</h3>
            <Link to="/goals" style={{ color: '#667eea', textDecoration: 'none' }}>
              Manage Goals
            </Link>
          </div>
          <GoalsProgress limit={3} />
        </div>
      </div>

      <div className="grid grid-4" style={{ marginTop: '30px' }}>
        <QuickActionCard 
          title="Add Transaction" 
          icon={CreditCard} 
          link="/transactions"
          description="Record a new expense or income"
        />
        <QuickActionCard 
          title="Create Budget" 
          icon={PieChart} 
          link="/budgets"
          description="Set up a new spending budget"
        />
        <QuickActionCard 
          title="Track Investment" 
          icon={TrendingUp} 
          link="/investments"
          description="Add new investment holding"
        />
        <QuickActionCard 
          title="Set Goal" 
          icon={Target} 
          link="/goals"
          description="Create a new financial goal"
        />
      </div>
    </div>
  );
}

function InvestmentSummary() {
  const { investments } = useFinance();
  
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const currentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const gain = currentValue - totalInvested;
  const gainPercentage = totalInvested > 0 ? (gain / totalInvested) * 100 : 0;

  return (
    <div>
      <div className="grid grid-2" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Invested</div>
          <div className="stat-value">${totalInvested.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current Value</div>
          <div className="stat-value">${currentValue.toLocaleString()}</div>
        </div>
      </div>
      
      <div className={`text-center ${gain >= 0 ? 'text-success' : 'text-danger'}`}>
        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
          {gain >= 0 ? '+' : ''}${gain.toLocaleString()} ({gainPercentage.toFixed(1)}%)
        </div>
        <div className="text-muted">Total Return</div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, icon: Icon, link, description }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ 
        textAlign: 'center', 
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px'
        }}>
          <Icon size={24} color="white" />
        </div>
        <h4 style={{ marginBottom: '8px' }}>{title}</h4>
        <p className="text-muted" style={{ fontSize: '14px' }}>{description}</p>
      </div>
    </Link>
  );
}

export default Dashboard;