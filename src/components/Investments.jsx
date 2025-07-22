import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import InvestmentModal from './InvestmentModal';

function Investments() {
  const { investments, deleteInvestment } = useFinance();
  const [showModal, setShowModal] = useState(false);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const currentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalGain = currentValue - totalInvested;
  const totalGainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  const getInvestmentTypeIcon = (type) => {
    const icons = {
      'Stock': '📈',
      'ETF': '📊',
      'Bond': '🏛️',
      'Mutual Fund': '💼',
      'Cryptocurrency': '₿',
      'Real Estate': '🏠',
      'Commodity': '🥇'
    };
    return icons[type] || '💰';
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="flex-between" style={{ marginBottom: '30px' }}>
        <h1>Investment Portfolio</h1>
        <button className="btn" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Investment
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-4" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Invested</div>
          <div className="stat-value">${totalInvested.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current Value</div>
          <div className="stat-value">${currentValue.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Gain/Loss</div>
          <div className={`stat-value ${totalGain >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Return %</div>
          <div className={`stat-value flex ${totalGainPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalGainPercentage >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {totalGainPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="grid grid-2">
        {investments.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="text-center text-muted" style={{ padding: '40px 0' }}>
              <div style={{ fontSize: '3em', marginBottom: '20px' }}>📈</div>
              <h3>No investments tracked yet</h3>
              <p>Start building your investment portfolio by adding your first investment.</p>
              <button className="btn" onClick={() => setShowModal(true)}>
                Add Your First Investment
              </button>
            </div>
          </div>
        ) : (
          investments.map((investment) => {
            const gain = investment.current_value - investment.amount;
            const gainPercentage = (gain / investment.amount) * 100;
            const daysSincePurchase = Math.floor(
              (new Date() - new Date(investment.purchase_date)) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={investment.id} className="card">
                <div className="flex-between" style={{ marginBottom: '15px' }}>
                  <div className="flex">
                    <div style={{ fontSize: '1.5em', marginRight: '12px' }}>
                      {getInvestmentTypeIcon(investment.type)}
                    </div>
                    <div>
                      <h3 style={{ marginBottom: '5px' }}>{investment.name}</h3>
                      <span style={{ 
                        background: '#f8f9fa', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#667eea',
                        fontWeight: 'bold'
                      }}>
                        {investment.type}
                      </span>
                    </div>
                  </div>
                  <button 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#ff6b6b',
                      cursor: 'pointer'
                    }}
                    onClick={() => deleteInvestment(investment.id)}
                    title="Remove investment"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-2" style={{ marginBottom: '20px' }}>
                  <div>
                    <div className="text-muted" style={{ fontSize: '14px' }}>Invested Amount</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      ${investment.amount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '14px' }}>Current Value</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      ${investment.current_value.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div className="flex-between">
                    <span className="text-muted">Performance</span>
                    <span className={`flex ${gain >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 'bold' }}>
                      {gain >= 0 ? <TrendingUp size={16} style={{ marginRight: '4px' }} /> : <TrendingDown size={16} style={{ marginRight: '4px' }} />}
                      {gain >= 0 ? '+' : ''}${gain.toLocaleString()} ({gainPercentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="text-muted" style={{ fontSize: '14px' }}>
                  <div>Purchase Date: {new Date(investment.purchase_date).toLocaleDateString()}</div>
                  <div>Holding Period: {daysSincePurchase} days</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Portfolio Allocation */}
      {investments.length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Portfolio Allocation</h3>
          <div className="grid grid-3">
            {[...new Set(investments.map(inv => inv.type))].map(type => {
              const typeInvestments = investments.filter(inv => inv.type === type);
              const typeValue = typeInvestments.reduce((sum, inv) => sum + inv.current_value, 0);
              const percentage = (typeValue / currentValue) * 100;

              return (
                <div key={type} className="text-center">
                  <div style={{ fontSize: '2em', marginBottom: '8px' }}>
                    {getInvestmentTypeIcon(type)}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{type}</div>
                  <div style={{ color: '#667eea', fontWeight: 'bold' }}>
                    ${typeValue.toLocaleString()}
                  </div>
                  <div className="text-muted">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <InvestmentModal 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Investments;