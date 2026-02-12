/**
 * LoadingSpinner Component
 * 
 * Animated loading indicator with optional message.
 * 
 * SIZES:
 * - sm: 20px
 * - md: 40px (default)
 * - lg: 60px
 * 
 * VARIANTS:
 * - primary: Purple
 * - white: White (for dark backgrounds)
 */

export default function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  message,
  fullPage = false,
}) {
  const getSizeValue = () => {
    const sizes = {
      sm: '20px',
      md: '40px',
      lg: '60px',
    }
    return sizes[size]
  }

  const getColor = () => {
    return variant === 'white' ? '#fff' : '#667eea'
  }

  const spinner = (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div
        style={{
          width: getSizeValue(),
          height: getSizeValue(),
          border: `3px solid ${getColor()}30`,
          borderTop: `3px solid ${getColor()}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && (
        <div style={{
          color: variant === 'white' ? '#fff' : '#666',
          fontSize: '14px',
          fontWeight: '500',
        }}>
          {message}
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        zIndex: 999,
      }}>
        {spinner}
      </div>
    )
  }

  return spinner
}
