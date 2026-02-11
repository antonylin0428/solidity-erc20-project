/**
 * Component: ToastContainer
 * 
 * PURPOSE:
 * - Renders all active toast notifications
 * - Positions toasts in corner of screen
 * - Handles animations (slide in/out)
 * - Styles toasts based on type
 * 
 * HOW IT WORKS:
 * - Reads toasts from ToastContext
 * - Maps over toasts array and renders each Toast
 * - Uses CSS transitions for smooth animations
 * - Positioned fixed to stay on screen while scrolling
 */

import { useToastContext } from '../hooks/useToast'

/**
 * Get styling for toast based on type
 * 
 * @param {string} type - 'success' | 'error' | 'info' | 'warning'
 * @returns {Object} Style object with colors and icon
 */
function getToastStyle(type) {
  const styles = {
    success: {
      background: '#d4edda',
      border: '2px solid #c3e6cb',
      color: '#155724',
      icon: '✓',
    },
    error: {
      background: '#f8d7da',
      border: '2px solid #f5c6cb',
      color: '#721c24',
      icon: '✗',
    },
    info: {
      background: '#d1ecf1',
      border: '2px solid #bee5eb',
      color: '#0c5460',
      icon: 'ℹ',
    },
    warning: {
      background: '#fff3cd',
      border: '2px solid #ffc107',
      color: '#856404',
      icon: '⚠',
    },
  }

  return styles[type] || styles.info
}

/**
 * Individual Toast Component
 * 
 * @param {Object} toast - Toast object
 * @param {Function} onClose - Callback to remove toast
 */
function Toast({ toast, onClose }) {
  const style = getToastStyle(toast.type)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'start',
        gap: '12px',
        padding: '16px 20px',
        background: style.background,
        border: style.border,
        borderRadius: '8px',
        color: style.color,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        marginBottom: '12px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out',
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        flexShrink: 0,
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {style.icon}
      </div>

      {/* Message */}
      <div style={{
        flex: 1,
        fontSize: '14px',
        lineHeight: '1.5',
        fontWeight: '500',
        wordBreak: 'break-word',
      }}>
        {toast.message}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: style.color,
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.6'}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}

/**
 * Toast Container Component
 * 
 * Renders all active toasts in a fixed position
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToastContext()

  return (
    <>
      {/* Inject CSS animations */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(400px);
              opacity: 0;
            }
          }
        `}
      </style>

      {/* Toast Container - Fixed position, top-right */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              toast={toast}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    </>
  )
}
