import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [goals, setGoals] = useState([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleData = {
      transactions: [
        {
          id: 1,
          amount: -85.50,
          date: new Date().toISOString().split('T')[0],
          category: 'Groceries',
          description: 'Weekly grocery shopping',
          account: 'Checking'
        },
        {
          id: 2,
          amount: -12.99,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: 'Entertainment',
          description: 'Netflix subscription',
          account: 'Credit Card'
        },
        {
          id: 3,
          amount: 3200.00,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: 'Income',
          description: 'Salary deposit',
          account: 'Checking'
        },
        {
          id: 4,
          amount: -45.00,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: 'Transportation',
          description: 'Gas station',
          account: 'Debit Card'
        },
        {
          id: 5,
          amount: -120.00,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          category: 'Utilities',
          description: 'Electric bill',
          account: 'Checking'
        }
      ],
      budgets: [
        {
          id: 1,
          name: 'Groceries',
          amount: 400,
          spent: 285.50,
          start_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-01',
          end_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-31'
        },
        {
          id: 2,
          name: 'Entertainment',
          amount: 150,
          spent: 67.99,
          start_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-01',
          end_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-31'
        },
        {
          id: 3,
          name: 'Transportation',
          amount: 300,
          spent: 145.00,
          start_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-01',
          end_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-31'
        },
        {
          id: 4,
          name: 'Utilities',
          amount: 200,
          spent: 120.00,
          start_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-01',
          end_date: new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-31'
        }
      ],
      investments: [
        {
          id: 1,
          name: 'Apple Inc.',
          type: 'Stock',
          amount: 5000,
          purchase_date: '2024-01-15',
          current_value: 5850
        },
        {
          id: 2,
          name: 'Vanguard S&P 500 ETF',
          type: 'ETF',
          amount: 3000,
          purchase_date: '2024-02-01',
          current_value: 3180
        },
        {
          id: 3,
          name: 'Tesla Inc.',
          type: 'Stock',
          amount: 2500,
          purchase_date: '2024-03-10',
          current_value: 2750
        }
      ],
      goals: [
        {
          id: 1,
          name: 'Emergency Fund',
          target_amount: 10000,
          current_amount: 3500,
          target_date: '2024-12-31',
          priority: 'High'
        },
        {
          id: 2,
          name: 'Vacation Fund',
          target_amount: 5000,
          current_amount: 1200,
          target_date: '2024-08-15',
          priority: 'Medium'
        },
        {
          id: 3,
          name: 'House Down Payment',
          target_amount: 50000,
          current_amount: 12000,
          target_date: '2025-06-30',
          priority: 'High'
        }
      ]
    };

    // Load from localStorage or use sample data
    const savedTransactions = localStorage.getItem('finanza_transactions');
    const savedBudgets = localStorage.getItem('finanza_budgets');
    const savedInvestments = localStorage.getItem('finanza_investments');
    const savedGoals = localStorage.getItem('finanza_goals');

    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : sampleData.transactions);
    setBudgets(savedBudgets ? JSON.parse(savedBudgets) : sampleData.budgets);
    setInvestments(savedInvestments ? JSON.parse(savedInvestments) : sampleData.investments);
    setGoals(savedGoals ? JSON.parse(savedGoals) : sampleData.goals);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('finanza_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finanza_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finanza_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('finanza_goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now(),
      spent: 0
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const addInvestment = (investment) => {
    const newInvestment = {
      ...investment,
      id: Date.now(),
      purchase_date: investment.purchase_date || new Date().toISOString().split('T')[0],
      current_value: investment.amount // Start with purchase amount
    };
    setInvestments(prev => [...prev, newInvestment]);
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      current_amount: 0
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId, amount) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current_amount: goal.current_amount + amount }
        : goal
    ));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const deleteInvestment = (id) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const value = {
    transactions,
    budgets,
    investments,
    goals,
    addTransaction,
    addBudget,
    addInvestment,
    addGoal,
    updateGoalProgress,
    deleteTransaction,
    deleteBudget,
    deleteInvestment,
    deleteGoal
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};