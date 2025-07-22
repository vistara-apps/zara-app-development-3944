import React from 'react'
import { format } from 'date-fns'
import { Target } from 'lucide-react'

function GoalsProgress({ goals }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
        <Target className="h-5 w-5 text-primary-600" />
      </div>
      
      <div className="space-y-6">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100
          const remaining = goal.target - goal.current
          
          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <p className="text-sm text-gray-600">
                    Target: ${goal.target.toLocaleString()} by {format(new Date(goal.target_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className="text-sm font-medium text-primary-600">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>${goal.current.toLocaleString()} saved</span>
                <span>${remaining.toLocaleString()} to go</span>
              </div>
            </div>
          )
        })}
        
        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No financial goals set yet. Create your first goal to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default GoalsProgress