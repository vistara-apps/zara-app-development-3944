import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { Plus, Target, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import GoalForm from '../components/GoalForm'

function Goals() {
  const { goals, addGoal, updateGoal } = useData()
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  const handleAddGoal = (goalData) => {
    addGoal(goalData)
    setShowForm(false)
  }

  const handleUpdateGoal = (goalData) => {
    updateGoal(editingGoal.id, goalData)
    setEditingGoal(null)
  }

  const handleAddToGoal = (goalId, amount) => {
    const goal = goals.find(g => g.id === goalId)
    if (goal) {
      updateGoal(goalId, { current: goal.current + amount })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100
          const remaining = goal.target - goal.current
          const daysUntilTarget = Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24))
          const isOverdue = daysUntilTarget < 0
          const isCompleted = percentage >= 100

          return (
            <div key={goal.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                </div>
                <button
                  onClick={() => setEditingGoal(goal)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className={`font-medium ${
                      isCompleted ? 'text-green-600' : 'text-primary-600'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-primary-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current</span>
                    <span className="font-medium">${goal.current.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target</span>
                    <span className="font-medium">${goal.target.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className={`font-medium ${
                      remaining <= 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      ${remaining > 0 ? remaining.toLocaleString() : '0'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t pt-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Target Date</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {format(new Date(goal.target_date), 'MMM d, yyyy')}
                      </div>
                      <div className={`text-xs ${
                        isOverdue ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {isCompleted ? 'Completed!' : isOverdue ? `${Math.abs(daysUntilTarget)} days overdue` : `${daysUntilTarget} days left`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Add Money */}
                {!isCompleted && (
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      {[50, 100, 250].map(amount => (
                        <button
                          key={amount}
                          onClick={() => handleAddToGoal(goal.id, amount)}
                          className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
                        >
                          +${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completion Badge */}
                {isCompleted && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-green-800 font-medium text-sm">🎉 Goal Completed!</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {goals.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No financial goals set yet</p>
            <p>Create your first goal to start working towards your financial dreams</p>
          </div>
        )}
      </div>

      {(showForm || editingGoal) && (
        <GoalForm
          goal={editingGoal}
          onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
          onCancel={() => {
            setShowForm(false)
            setEditingGoal(null)
          }}
        />
      )}
    </div>
  )
}

export default Goals