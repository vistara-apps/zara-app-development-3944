import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Target, Wallet } from 'lucide-react'

function DashboardStats({ totalIncome, totalExpenses, totalBudget, totalSpent, netWorth }) {
  const stats = [
    {
      name: 'Monthly Income',
      value: `$${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      name: 'Monthly Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      name: 'Budget Used',
      value: `${totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%`,
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      name: 'Net Worth',
      value: `$${netWorth.toLocaleString()}`,
      icon: Wallet,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="flex items-center">
            <div className={`${stat.bg} p-3 rounded-full`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats