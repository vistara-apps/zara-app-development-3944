import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

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

  useEffect(() => {
    if (user) {
      // Load sample data
      loadSampleData()
    }
  }, [user])

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
      date: new Date().toISOString().split('T')[0]
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now(),
      spent: 0
    }
    setBudgets(prev => [...prev, newBudget])
  }

  const updateBudget = (id, updates) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === id ? { ...budget, ...updates } : budget
    ))
  }

  const addInvestment = (investment) => {
    const newInvestment = {
      ...investment,
      id: Date.now(),
      purchase_date: new Date().toISOString().split('T')[0],
      current_value: investment.amount
    }
    setInvestments(prev => [...prev, newInvestment])
  }

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      current: 0
    }
    setGoals(prev => [...prev, newGoal])
  }

  const updateGoal = (id, updates) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ))
  }

  const value = {
    transactions,
    budgets,
    investments,
    goals,
    addTransaction,
    addBudget,
    updateBudget,
    addInvestment,
    addGoal,
    updateGoal
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}