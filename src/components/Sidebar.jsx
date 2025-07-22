import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Target,
  DollarSign
} from 'lucide-react'

function Sidebar() {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Budgets', href: '/budgets', icon: PiggyBank },
    { name: 'Investments', href: '/investments', icon: TrendingUp },
    { name: 'Goals', href: '/goals', icon: Target },
  ]

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <DollarSign className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">Finanza</span>
      </div>
      
      <nav className="px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar