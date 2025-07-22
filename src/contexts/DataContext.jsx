import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { 
  transactionStorage, 
  budgetStorage, 
  investmentStorage, 
  goalStorage 
} from '../utils/storage'

const DataContext = createContext()

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [investments, setInvestments] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load data when user logs in
  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      // Clear data when user logs out
      setTransactions([])
      setBudgets([])
      setInvestments([])
      setGoals([])
    }
  }, [user])

  const loadUserData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load data from storage
      const storedTransactions = transactionStorage.get()
      const storedBudgets = budgetStorage.get()
      const storedInvestments = investmentStorage.get()
      const storedGoals = goalStorage.get()

      // If no data exists, load sample data
      if (storedTransactions.length === 0) {
        loadSampleData()
      } else {
        setTransactions(storedTransactions)
        setBudgets(storedBudgets)
        setInvestments(storedInvestments)
        setGoals(storedGoals)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
      setError('Failed to load your financial data')
      // Load sample data as fallback
      loadSampleData()
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    // Sample transactions
    const sampleTransactions = [
      { id: 1, amount: -45.67, date: '2024-01-15', category: 'Groceries', description: 'Whole Foods', account: 'Checking' },
      { id: 2, amount: -12.50, date: '2024-01-14', category: 'Transportation', description: 'Uber', account: 'Credit Card' },
      { id: 3, amount: -89.99, date: '2024-01-13', category: 'Utilities', description: 'Electric Bill', account: 'Checking' },
      { id: 4, amount: 3500.00, date: '2024-01-01', category: 'Income', description: 'Salary Deposit', account: 'Checking' },
      { id: 5, amount: -156.78, date: '2024-01-12', category: 'Entertainment', description: 'Netflix, Spotify', account: 'Credit Card' },
    ]

    // Sample budgets
    const sampleBudgets = [
      { id: 1, name: 'Groceries', amount: 400, spent: 280, start_date: '2024-01-01', end_date: '2024-01-31' },
      { id: 2, name: 'Transportation', amount: 200, spent: 145, start_date: '2024-01-01', end_date: '2024-01-31' },
      { id: 3, name: 'Entertainment', amount: 150, spent: 89, start_date: '2024-01-01', end_date: '2024-01-31' },
      { id: 4, name: 'Utilities', amount: 300, spent: 245, start_date: '2024-01-01', end_date: '2024-01-31' },
    ]

    // Sample investments
    const sampleInvestments = [
      { id: 1, name: 'Apple Inc. (AAPL)', type: 'Stock', amount: 5000, purchase_date: '2023-06-15', current_value: 5750 },
      { id: 2, name: 'Vanguard S&P 500 ETF', type: 'ETF', amount: 10000, purchase_date: '2023-03-10', current_value: 11200 },
      { id: 3, name: 'Tesla Inc. (TSLA)', type: 'Stock', amount: 3000, purchase_date: '2023-09-20', current_value: 3450 },
      { id: 4, name: 'Bond Index Fund', type: 'Bond', amount: 8000, purchase_date: '2023-01-05', current_value: 8160 },
    ]

    // Sample goals
    const sampleGoals = [
      { id: 1, name: 'Emergency Fund', target: 15000, current: 8500, target_date: '2024-12-31' },
      { id: 2, name: 'Vacation to Europe', target: 5000, current: 2200, target_date: '2024-07-15' },
      { id: 3, name: 'New Car Down Payment', target: 8000, current: 3800, target_date: '2024-09-01' },
    ]

    setTransactions(sampleTransactions)
    setBudgets(sampleBudgets)
    setInvestments(sampleInvestments)
    setGoals(sampleGoals)
  }

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
    
    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    transactionStorage.set(updatedTransactions)
    
    return newTransaction
  }

  const updateTransaction = (id, updates) => {
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...updates, updatedAt: new Date().toISOString() } : transaction
    )
    setTransactions(updatedTransactions)
    transactionStorage.set(updatedTransactions)
  }

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id)
    setTransactions(updatedTransactions)
    transactionStorage.set(updatedTransactions)
  }

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now(),
      spent: 0,
      createdAt: new Date().toISOString()
    }
    
    const updatedBudgets = [...budgets, newBudget]
    setBudgets(updatedBudgets)
    budgetStorage.set(updatedBudgets)
    
    return newBudget
  }

  const updateBudget = (id, updates) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === id ? { ...budget, ...updates, updatedAt: new Date().toISOString() } : budget
    )
    setBudgets(updatedBudgets)
    budgetStorage.set(updatedBudgets)
  }

  const deleteBudget = (id) => {
    const updatedBudgets = budgets.filter(b => b.id !== id)
    setBudgets(updatedBudgets)
    budgetStorage.set(updatedBudgets)
  }

  const addInvestment = (investment) => {
    const newInvestment = {
      ...investment,
      id: Date.now(),
      purchase_date: new Date().toISOString().split('T')[0],
      current_value: investment.amount,
      createdAt: new Date().toISOString()
    }
    
    const updatedInvestments = [...investments, newInvestment]
    setInvestments(updatedInvestments)
    investmentStorage.set(updatedInvestments)
    
    return newInvestment
  }

  const updateInvestment = (id, updates) => {
    const updatedInvestments = investments.map(investment => 
      investment.id === id ? { ...investment, ...updates, updatedAt: new Date().toISOString() } : investment
    )
    setInvestments(updatedInvestments)
    investmentStorage.set(updatedInvestments)
  }

  const deleteInvestment = (id) => {
    const updatedInvestments = investments.filter(i => i.id !== id)
    setInvestments(updatedInvestments)
    investmentStorage.set(updatedInvestments)
  }

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      current: 0,
      createdAt: new Date().toISOString()
    }
    
    const updatedGoals = [...goals, newGoal]
    setGoals(updatedGoals)
    goalStorage.set(updatedGoals)
    
    return newGoal
  }

  const updateGoal = (id, updates) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, ...updates, updatedAt: new Date().toISOString() } : goal
    )
    setGoals(updatedGoals)
    goalStorage.set(updatedGoals)
  }

  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(g => g.id !== id)
    setGoals(updatedGoals)
    goalStorage.set(updatedGoals)
  }

  // Computed values for dashboard
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const totalInvestments = investments
      .reduce((sum, i) => sum + i.current_value, 0)
    
    const totalGoalsTarget = goals
      .reduce((sum, g) => sum + g.target, 0)
    
    const totalGoalsCurrent = goals
      .reduce((sum, g) => sum + g.current, 0)

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      totalInvestments,
      totalGoalsTarget,
      totalGoalsCurrent,
      goalsProgress: totalGoalsTarget > 0 ? (totalGoalsCurrent / totalGoalsTarget) * 100 : 0
    }
  }, [transactions, investments, goals])

  const value = {
    // Data
    transactions,
    budgets,
    investments,
    goals,
    stats,
    loading,
    error,
    
    // Transaction methods
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Budget methods
    addBudget,
    updateBudget,
    deleteBudget,
    
    // Investment methods
    addInvestment,
    updateInvestment,
    deleteInvestment,
    
    // Goal methods
    addGoal,
    updateGoal,
    deleteGoal,
    
    // Utility methods
    loadUserData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
