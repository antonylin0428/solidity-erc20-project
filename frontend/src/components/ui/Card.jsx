/**
 * Card Component
 * 
 * Reusable container component with consistent styling.
 * 
 * PROPS:
 * - children: Content to display
 * - padding: Padding size (sm, md, lg, none)
 * - hover: Enable hover effect
 * - onClick: Click handler (makes card interactive)
 */

export default function Card({
  children,
  padding = 'md',
  hover = false,
  onClick,
  style = {},
  ...props
}) {
  const getPaddingStyles = () => {
    const paddings = {
      none: '0',
      sm: '16px',
      md: '24px',
      lg: '32px',
    }
    return paddings[padding]
  }

  const baseStyle = {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: getPaddingStyles(),
    transition: hover || onClick ? 'all 0.2s' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }

  const handleMouseEnter = (e) => {
    if (hover || onClick) {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    }
  }

  const handleMouseLeave = (e) => {
    if (hover || onClick) {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
    }
  }

  return (
    <div
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
}
