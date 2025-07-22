import React from 'react'
import { format } from 'date-fns'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

function RecentTransactions({ transactions }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.amount > 0 ? (
                  <ArrowUpCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{transaction.account}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {format(new Date(transaction.date), 'MMM d')}
              </p>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent transactions
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentTransactions