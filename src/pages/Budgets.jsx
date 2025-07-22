import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Edit3 } from 'lucide-react'
import BudgetForm from '../components/BudgetForm'

function Budgets() {
  const { budgets, addBudget, updateBudget } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  const handleAddBudget = (budgetData) => {
    addBudget(budgetData)
    setShowForm(false)
  }

  const handleEditBudget = (budgetData) => {
    updateBudget(editingBudget.id, budgetData)
    setEditingBudget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Budget</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100
          const isOverBudget = percentage > 100
          const remaining = budget.amount - budget.spent

          return (
            <div key={budget.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingBudget(budget)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">${budget.amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className={isOverBudget ? 'text-red-600 font-medium' : 'font-medium'}>
                    ${budget.spent.toFixed(2)}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isOverBudget 
                        ? 'bg-red-500' 
                        : percentage > 75 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className={`text-sm font-medium ${
                    remaining < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ${remaining < 0 ? 'Over by ' : ''}${Math.abs(remaining).toFixed(2)}
                    {remaining >= 0 ? ' left' : ''}
                  </span>
                </div>

                <div className="text-xs text-gray-500 border-t pt-2">
                  {budget.start_date} to {budget.end_date}
                </div>
              </div>
            </div>
          )
        })}

        {budgets.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No budgets created yet</p>
            <p>Create your first budget to start tracking your spending</p>
          </div>
        )}
      </div>

      {(showForm || editingBudget) && (
        <BudgetForm
          budget={editingBudget}
          onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
          onCancel={() => {
            setShowForm(false)
            setEditingBudget(null)
          }}
        />
      )}
    </div>
  )
}

export default Budgets