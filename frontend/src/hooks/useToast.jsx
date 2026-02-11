/**
 * Custom Hook: useToast
 * 
 * PURPOSE:
 * - Provide a clean API for showing toast notifications
 * - Replace ugly alert() popups with modern toasts
 * - Support multiple notification types (success, error, info, warning)
 * 
 * HOW IT WORKS:
 * - Uses React Context to manage global toast state
 * - Components call toast.success(), toast.error(), etc.
 * - ToastContainer component renders the toasts
 * - Auto-dismisses after configurable timeout
 * 
 * USAGE EXAMPLE:
 * const toast = useToast()
 * 
 * // Success notification
 * toast.success('Transaction confirmed!')
 * 
 * // Error notification
 * toast.error('Transaction failed. Please try again.')
 * 
 * // With custom duration
 * toast.info('Loading...', { duration: 5000 })
 */

import { createContext, useContext, useState, useCallback } from 'react'

// Create context for toast state
const ToastContext = createContext(null)

/**
 * Toast Provider Component
 * 
 * Wrap your app with this to enable toasts everywhere
 * 
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export function ToastProvider({ children }) {
  // State to hold array of active toasts
  const [toasts, setToasts] = useState([])

  /**
   * Add a new toast
   * 
   * @param {string} message - Toast message text
   * @param {Object} options - Configuration options
   * @param {string} options.type - 'success' | 'error' | 'info' | 'warning'
   * @param {number} options.duration - Time in ms before auto-dismiss (default: 4000)
   */
  const addToast = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 4000,
    } = options

    // Generate unique ID for this toast
    const id = Date.now() + Math.random()

    // Create toast object
    const newToast = {
      id,
      message,
      type,
      duration,
    }

    // Add to toasts array
    setToasts(prev => [...prev, newToast])

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  /**
   * Remove a toast by ID
   * 
   * @param {number} id - Toast ID to remove
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  /**
   * Clear all toasts
   */
  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  // Create toast API with helper methods
  const toast = useCallback((message, options) => {
    return addToast(message, options)
  }, [addToast])

  // Helper methods for each type
  toast.success = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'success' })
  }, [addToast])

  toast.error = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'error' })
  }, [addToast])

  toast.info = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'info' })
  }, [addToast])

  toast.warning = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'warning' })
  }, [addToast])

  // Promise helper for async operations
  toast.promise = useCallback(async (promise, messages) => {
    const loadingId = addToast(messages.loading || 'Loading...', { 
      type: 'info',
      duration: 0, // Don't auto-dismiss
    })

    try {
      const result = await promise
      removeToast(loadingId)
      addToast(messages.success || 'Success!', { type: 'success' })
      return result
    } catch (error) {
      removeToast(loadingId)
      addToast(messages.error || 'Error occurred', { type: 'error' })
      throw error
    }
  }, [addToast, removeToast])

  // Context value
  const value = {
    toasts,
    toast,
    removeToast,
    clearAll,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Hook to access toast API
 * 
 * @returns {Object} Toast API
 * 
 * EXAMPLE:
 * const toast = useToast()
 * toast.success('Done!')
 */
export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  
  return context.toast
}

/**
 * Hook to access full toast context (for ToastContainer)
 * 
 * @returns {Object} Toast context with toasts array and methods
 */
export function useToastContext() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  
  return context
}
