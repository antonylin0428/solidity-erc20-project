/**
 * Button Component
 * 
 * Reusable button with multiple variants and sizes.
 * 
 * VARIANTS:
 * - primary: Main action buttons (purple)
 * - secondary: Less prominent actions (gray)
 * - success: Positive actions (green)
 * - danger: Destructive actions (red)
 * - outline: Outlined button
 * - ghost: Minimal styling
 * 
 * SIZES:
 * - sm: Small
 * - md: Medium (default)
 * - lg: Large
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) {
  const getVariantStyles = () => {
    const baseStyle = {
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: disabled ? 0.6 : 1,
    }

    const variants = {
      primary: {
        background: '#667eea',
        color: 'white',
        border: '2px solid #667eea',
      },
      secondary: {
        background: '#6c757d',
        color: 'white',
        border: '2px solid #6c757d',
      },
      success: {
        background: '#28a745',
        color: 'white',
        border: '2px solid #28a745',
      },
      danger: {
        background: '#dc3545',
        color: 'white',
        border: '2px solid #dc3545',
      },
      outline: {
        background: 'transparent',
        color: '#667eea',
        border: '2px solid #667eea',
      },
      ghost: {
        background: 'transparent',
        color: '#333',
        border: '2px solid transparent',
      },
    }

    return { ...baseStyle, ...variants[variant] }
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '6px 12px',
        fontSize: '13px',
      },
      md: {
        padding: '10px 20px',
        fontSize: '14px',
      },
      lg: {
        padding: '14px 28px',
        fontSize: '16px',
      },
    }

    return sizes[size]
  }

  const handleMouseEnter = (e) => {
    if (disabled) return
    
    switch (variant) {
      case 'primary':
        e.target.style.background = '#5568d3'
        break
      case 'secondary':
        e.target.style.background = '#5a6268'
        break
      case 'success':
        e.target.style.background = '#218838'
        break
      case 'danger':
        e.target.style.background = '#c82333'
        break
      case 'outline':
        e.target.style.background = '#667eea'
        e.target.style.color = 'white'
        break
      case 'ghost':
        e.target.style.background = '#f8f9fa'
        break
    }
  }

  const handleMouseLeave = (e) => {
    if (disabled) return

    const variantStyles = getVariantStyles()
    e.target.style.background = variantStyles.background
    e.target.style.color = variantStyles.color
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        width: fullWidth ? '100%' : 'auto',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  )
}
