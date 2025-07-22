import React from 'react'
import { TrendingUp, AlertTriangle } from 'lucide-react'

function BudgetOverview({ budgets }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
      </div>
      
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100
          const isOverBudget = percentage > 100
          const isWarning = percentage > 75 && percentage <= 100
          
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{budget.name}</span>
                  {isOverBudget && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  {isWarning && (
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isOverBudget 
                      ? 'bg-red-500' 
                      : isWarning 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className={`${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                  {percentage.toFixed(1)}% used
                </span>
                <span className="text-gray-600">
                  ${(budget.amount - budget.spent).toFixed(2)} remaining
                </span>
              </div>
            </div>
          )
        })}
        
        {budgets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No budgets created yet. Start by creating your first budget!
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetOverview