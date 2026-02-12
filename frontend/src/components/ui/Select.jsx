/**
 * Select Component
 * 
 * Standardized select/dropdown field with label.
 * 
 * FEATURES:
 * - Label support
 * - Error state
 * - Help text
 * - Consistent styling with Input
 */

export default function Select({
  label,
  error,
  helpText,
  fullWidth = true,
  children,
  ...props
}) {
  return (
    <div style={{ marginBottom: '16px', width: fullWidth ? '100%' : 'auto' }}>
      {/* Label */}
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: error ? '#dc3545' : '#333',
        }}>
          {label}
          {props.required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      {/* Select Field */}
      <select
        style={{
          width: '100%',
          padding: '10px 12px',
          border: `2px solid ${error ? '#dc3545' : '#ddd'}`,
          borderRadius: '6px',
          fontSize: '14px',
          background: error ? '#fff5f5' : 'white',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = '#667eea'
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = '#ddd'
            e.target.style.boxShadow = 'none'
          }
        }}
        {...props}
      >
        {children}
      </select>

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '4px',
          fontSize: '12px',
          color: '#dc3545',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <div style={{
          marginTop: '4px',
          fontSize: '12px',
          color: '#6c757d',
        }}>
          {helpText}
        </div>
      )}
    </div>
  )
}
