/**
 * Badge Component
 * 
 * Small status indicator with color variants.
 * 
 * VARIANTS:
 * - success: Green (passed, executed, active)
 * - danger: Red (failed, rejected)
 * - warning: Yellow (pending, expiring soon)
 * - info: Blue (informational)
 * - secondary: Gray (neutral)
 * 
 * SIZES:
 * - sm: Small
 * - md: Medium (default)
 * - lg: Large
 */

export default function Badge({
  children,
  variant = 'secondary',
  size = 'md',
  ...props
}) {
  const getVariantStyles = () => {
    const variants = {
      success: {
        background: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
      },
      danger: {
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
      },
      warning: {
        background: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffc107',
      },
      info: {
        background: '#d1ecf1',
        color: '#0c5460',
        border: '1px solid #bee5eb',
      },
      secondary: {
        background: '#e9ecef',
        color: '#495057',
        border: '1px solid #dee2e6',
      },
      primary: {
        background: '#667eea',
        color: 'white',
        border: '1px solid #667eea',
      },
    }

    return variants[variant] || variants.secondary
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '2px 8px',
        fontSize: '11px',
        borderRadius: '8px',
      },
      md: {
        padding: '4px 12px',
        fontSize: '12px',
        borderRadius: '12px',
      },
      lg: {
        padding: '6px 16px',
        fontSize: '14px',
        borderRadius: '16px',
      },
    }

    return sizes[size]
  }

  return (
    <span
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
      }}
      {...props}
    >
      {children}
    </span>
  )
}
