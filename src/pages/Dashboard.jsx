import React from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import DashboardStats from '../components/DashboardStats'
import RecentTransactions from '../components/RecentTransactions'
import BudgetOverview from '../components/BudgetOverview'
import GoalsProgress from '../components/GoalsProgress'
import SpendingChart from '../components/SpendingChart'

function Dashboard() {
  const { user } = useAuth()
  const { transactions, budgets, goals } = useData()

  // Calculate dashboard metrics
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const now = new Date()
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear()
  })

  const totalIncome = thisMonthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = Math.abs(thisMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your financial overview for this month.</p>
      </div>

      <DashboardStats 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        netWorth={user?.net_worth || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SpendingChart transactions={thisMonthTransactions} />
        <BudgetOverview budgets={budgets} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions transactions={transactions.slice(0, 5)} />
        <GoalsProgress goals={goals} />
      </div>
    </div>
  )
}

export default Dashboard