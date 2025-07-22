import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

function BudgetForm({ budget, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name,
        amount: budget.amount.toString(),
        start_date: budget.start_date,
        end_date: budget.end_date
      })
    } else {
      // Set default dates for new budget (current month)
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      setFormData(prev => ({
        ...prev,
        start_date: firstDay.toISOString().split('T')[0],
        end_date: lastDay.toISOString().split('T')[0]
      }))
    }
  }, [budget])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    })
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const suggestedCategories = [
    'Groceries', 'Transportation', 'Utilities', 'Entertainment', 
    'Healthcare', 'Shopping', 'Dining', 'Rent/Mortgage', 
    'Insurance', 'Phone/Internet', 'Gas', 'Gym/Fitness'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {budget ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Groceries, Transportation"
              className="input"
              list="categories"
            />
            <datalist id="categories">
              {suggestedCategories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Amount
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter budget amount"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {budget ? 'Update Budget' : 'Create Budget'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetForm