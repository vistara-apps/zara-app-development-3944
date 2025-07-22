import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

function GoalForm({ goal, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    target_date: '',
    current: ''
  })

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        target: goal.target.toString(),
        target_date: goal.target_date,
        current: goal.current.toString()
      })
    } else {
      // Set default target date to 1 year from now
      const nextYear = new Date()
      nextYear.setFullYear(nextYear.getFullYear() + 1)
      
      setFormData(prev => ({
        ...prev,
        target_date: nextYear.toISOString().split('T')[0],
        current: '0'
      }))
    }
  }, [goal])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      target: parseFloat(formData.target),
      current: parseFloat(formData.current || 0)
    })
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const suggestedGoals = [
    'Emergency Fund',
    'Vacation Fund',
    'New Car',
    'House Down Payment',
    'Wedding Fund',
    'Home Renovation',
    'Retirement Savings',
    'Education Fund',
    'Debt Payoff',
    'Investment Portfolio'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {goal ? 'Edit Goal' : 'Create Financial Goal'}
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
              Goal Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Emergency Fund, Vacation"
              className="input"
              list="goal-suggestions"
            />
            <datalist id="goal-suggestions">
              {suggestedGoals.map(goalName => (
                <option key={goalName} value={goalName} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount
            </label>
            <input
              type="number"
              name="target"
              step="0.01"
              min="0"
              required
              value={formData.target}
              onChange={handleChange}
              placeholder="Enter target amount"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              type="date"
              name="target_date"
              required
              value={formData.target_date}
              onChange={handleChange}
              className="input"
            />
          </div>

          {goal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Amount
              </label>
              <input
                type="number"
                name="current"
                step="0.01"
                min="0"
                value={formData.current}
                onChange={handleChange}
                placeholder="Current saved amount"
                className="input"
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Goal Planning Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Set realistic and specific targets</li>
              <li>• Break large goals into smaller milestones</li>
              <li>• Automate savings when possible</li>
              <li>• Review and adjust regularly</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {goal ? 'Update Goal' : 'Create Goal'}
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

export default GoalForm