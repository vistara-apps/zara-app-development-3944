import { useState, useCallback, useMemo } from 'react'
import { validateForm } from '../utils/validation'

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate single field
  const validateField = useCallback((name, value) => {
    if (validationRules[name]) {
      const error = validationRules[name](value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
      return error
    }
    return null
  }, [validationRules])

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))

    // Validate field if it has been touched
    if (touched[name]) {
      validateField(name, value)
    }
  }, [touched, validateField])

  // Handle input blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validate field on blur
    validateField(name, values[name])
  }, [values, validateField])

  // Validate entire form
  const validate = useCallback(() => {
    const { errors: formErrors, isValid } = validateForm(values, validationRules)
    setErrors(formErrors)
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)
    
    return isValid
  }, [values, validationRules])

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true)
    
    try {
      const isValid = validate()
      
      if (isValid) {
        await onSubmit(values)
      }
      
      return isValid
    } catch (error) {
      console.error('Form submission error:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate])

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.keys(errors).every(key => !errors[key])
  }, [errors])

  // Check if form has been modified
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues)
  }, [values, initialValues])

  // Get field props for easy integration with inputs
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: (e) => handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    error: touched[name] ? errors[name] : null,
    hasError: touched[name] && !!errors[name]
  }), [values, errors, touched, handleChange, handleBlur])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    setFieldValue,
    setFieldError,
    getFieldProps
  }
}

