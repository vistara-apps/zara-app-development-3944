import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import InvestmentForm from '../components/InvestmentForm'

function Investments() {
  const { investments, addInvestment } = useData()
  const [showForm, setShowForm] = useState(false)

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0)
  const totalGainLoss = totalCurrentValue - totalInvestment
  const percentageChange = totalInvestment > 0 ? ((totalGainLoss / totalInvestment) * 100) : 0

  const handleAddInvestment = (investmentData) => {
    addInvestment(investmentData)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Investment</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalInvestment.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalCurrentValue.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${
                totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
              </p>
              <p className={`text-sm ${
                totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment List */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invested
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/Loss
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => {
                const gainLoss = investment.current_value - investment.amount
                const percentageChange = ((gainLoss / investment.amount) * 100)
                
                return (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {investment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {investment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(investment.purchase_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${investment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${investment.current_value.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div>
                        {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                      </div>
                      <div className="text-xs">
                        {gainLoss >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {investments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No investments tracked yet</p>
              <p>Add your first investment to start tracking your portfolio performance</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <InvestmentForm
          onSubmit={handleAddInvestment}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default Investments