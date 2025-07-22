// Validation utility functions
export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required'
    }
    return null
  },

  email: (value) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return null
  },

  minLength: (min) => (value) => {
    if (!value) return null
    if (value.length < min) {
      return `Must be at least ${min} characters long`
    }
    return null
  },

  maxLength: (max) => (value) => {
    if (!value) return null
    if (value.length > max) {
      return `Must be no more than ${max} characters long`
    }
    return null
  },

  number: (value) => {
    if (!value) return null
    if (isNaN(Number(value))) {
      return 'Must be a valid number'
    }
    return null
  },

  positiveNumber: (value) => {
    if (!value) return null
    const num = Number(value)
    if (isNaN(num) || num <= 0) {
      return 'Must be a positive number'
    }
    return null
  },

  currency: (value) => {
    if (!value) return null
    const num = Number(value)
    if (isNaN(num)) {
      return 'Must be a valid amount'
    }
    if (num < 0) {
      return 'Amount cannot be negative'
    }
    // Check for reasonable decimal places (max 2)
    if (value.toString().includes('.') && value.toString().split('.')[1].length > 2) {
      return 'Amount can have at most 2 decimal places'
    }
    return null
  },

  date: (value) => {
    if (!value) return null
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date'
    }
    return null
  },

  futureDate: (value) => {
    if (!value) return null
    const date = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date <= today) {
      return 'Date must be in the future'
    }
    return null
  },

  pastDate: (value) => {
    if (!value) return null
    const date = new Date(value)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    if (date > today) {
      return 'Date cannot be in the future'
    }
    return null
  },

  passwordStrength: (value) => {
    if (!value) return null
    
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
    
    if (value.length < minLength) {
      return `Password must be at least ${minLength} characters long`
    }
    
    const strengthChecks = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    const passedChecks = strengthChecks.filter(Boolean).length
    
    if (passedChecks < 3) {
      return 'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters'
    }
    
    return null
  },

  confirmPassword: (originalPassword) => (value) => {
    if (!value) return null
    if (value !== originalPassword) {
      return 'Passwords do not match'
    }
    return null
  }
}

// Combine multiple validators
export const combineValidators = (...validatorFunctions) => (value) => {
  for (const validator of validatorFunctions) {
    const error = validator(value)
    if (error) return error
  }
  return null
}

// Validate entire form
export const validateForm = (values, validationRules) => {
  const errors = {}
  
  Object.keys(validationRules).forEach(field => {
    const validator = validationRules[field]
    const error = validator(values[field])
    if (error) {
      errors[field] = error
    }
  })
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

// Format currency for display
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format date for display
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date))
}

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

