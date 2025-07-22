// Secure storage utilities for financial data
const STORAGE_PREFIX = 'finanza_'
const STORAGE_VERSION = '1.0'

// Storage keys
export const STORAGE_KEYS = {
  USER: `${STORAGE_PREFIX}user`,
  TRANSACTIONS: `${STORAGE_PREFIX}transactions`,
  BUDGETS: `${STORAGE_PREFIX}budgets`,
  INVESTMENTS: `${STORAGE_PREFIX}investments`,
  GOALS: `${STORAGE_PREFIX}goals`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  VERSION: `${STORAGE_PREFIX}version`
}

// Safe JSON parsing with error handling
const safeJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    console.warn('Failed to parse JSON from storage:', error)
    return fallback
  }
}

// Safe JSON stringifying
const safeJsonStringify = (value) => {
  try {
    return JSON.stringify(value)
  } catch (error) {
    console.error('Failed to stringify value for storage:', error)
    return null
  }
}

// Check if localStorage is available
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (error) {
    return false
  }
}

// Storage class with encryption simulation and error handling
class SecureStorage {
  constructor() {
    this.available = isStorageAvailable()
    this.initializeVersion()
  }

  initializeVersion() {
    if (this.available) {
      const currentVersion = this.getItem(STORAGE_KEYS.VERSION)
      if (!currentVersion) {
        this.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION)
      }
    }
  }

  // Basic encryption simulation (in production, use proper encryption)
  encrypt(data) {
    // This is a simple obfuscation, not real encryption
    // In production, use proper encryption libraries
    return btoa(JSON.stringify(data))
  }

  decrypt(encryptedData) {
    try {
      return JSON.parse(atob(encryptedData))
    } catch (error) {
      console.warn('Failed to decrypt data:', error)
      return null
    }
  }

  setItem(key, value, encrypt = false) {
    if (!this.available) {
      console.warn('Storage not available')
      return false
    }

    try {
      const dataToStore = encrypt ? this.encrypt(value) : safeJsonStringify(value)
      if (dataToStore !== null) {
        localStorage.setItem(key, dataToStore)
        return true
      }
    } catch (error) {
      console.error('Failed to set item in storage:', error)
    }
    return false
  }

  getItem(key, decrypt = false) {
    if (!this.available) {
      return null
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) return null

      if (decrypt) {
        return this.decrypt(item)
      }
      
      return safeJsonParse(item)
    } catch (error) {
      console.error('Failed to get item from storage:', error)
      return null
    }
  }

  removeItem(key) {
    if (!this.available) {
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove item from storage:', error)
      return false
    }
  }

  clear() {
    if (!this.available) {
      return false
    }

    try {
      // Only clear Finanza-related items
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Failed to clear storage:', error)
      return false
    }
  }

  // Get storage usage info
  getStorageInfo() {
    if (!this.available) {
      return { available: false }
    }

    try {
      const used = new Blob(Object.values(localStorage)).size
      const quota = 5 * 1024 * 1024 // 5MB typical localStorage limit
      
      return {
        available: true,
        used,
        quota,
        percentage: (used / quota) * 100
      }
    } catch (error) {
      return { available: true, error: error.message }
    }
  }

  // Backup data to JSON
  exportData() {
    const data = {}
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const value = this.getItem(key)
      if (value !== null) {
        data[name.toLowerCase()] = value
      }
    })

    return {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      data
    }
  }

  // Restore data from backup
  importData(backupData) {
    try {
      if (!backupData.data) {
        throw new Error('Invalid backup format')
      }

      // Clear existing data
      this.clear()

      // Import data
      Object.entries(backupData.data).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name.toUpperCase()]
        if (key) {
          this.setItem(key, value)
        }
      })

      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }
}

// Create singleton instance
const storage = new SecureStorage()

// Convenience functions for specific data types
export const userStorage = {
  get: () => storage.getItem(STORAGE_KEYS.USER, true), // Encrypt user data
  set: (user) => storage.setItem(STORAGE_KEYS.USER, user, true),
  remove: () => storage.removeItem(STORAGE_KEYS.USER)
}

export const transactionStorage = {
  get: () => storage.getItem(STORAGE_KEYS.TRANSACTIONS) || [],
  set: (transactions) => storage.setItem(STORAGE_KEYS.TRANSACTIONS, transactions),
  add: (transaction) => {
    const transactions = transactionStorage.get()
    transactions.unshift(transaction)
    return transactionStorage.set(transactions)
  },
  remove: (id) => {
    const transactions = transactionStorage.get()
    const filtered = transactions.filter(t => t.id !== id)
    return transactionStorage.set(filtered)
  }
}

export const budgetStorage = {
  get: () => storage.getItem(STORAGE_KEYS.BUDGETS) || [],
  set: (budgets) => storage.setItem(STORAGE_KEYS.BUDGETS, budgets),
  add: (budget) => {
    const budgets = budgetStorage.get()
    budgets.push(budget)
    return budgetStorage.set(budgets)
  },
  update: (id, updates) => {
    const budgets = budgetStorage.get()
    const updated = budgets.map(b => b.id === id ? { ...b, ...updates } : b)
    return budgetStorage.set(updated)
  }
}

export const investmentStorage = {
  get: () => storage.getItem(STORAGE_KEYS.INVESTMENTS) || [],
  set: (investments) => storage.setItem(STORAGE_KEYS.INVESTMENTS, investments),
  add: (investment) => {
    const investments = investmentStorage.get()
    investments.push(investment)
    return investmentStorage.set(investments)
  }
}

export const goalStorage = {
  get: () => storage.getItem(STORAGE_KEYS.GOALS) || [],
  set: (goals) => storage.setItem(STORAGE_KEYS.GOALS, goals),
  add: (goal) => {
    const goals = goalStorage.get()
    goals.push(goal)
    return goalStorage.set(goals)
  },
  update: (id, updates) => {
    const goals = goalStorage.get()
    const updated = goals.map(g => g.id === id ? { ...g, ...updates } : g)
    return goalStorage.set(updated)
  }
}

export default storage

