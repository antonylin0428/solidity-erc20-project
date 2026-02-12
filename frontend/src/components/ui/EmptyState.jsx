/**
 * EmptyState Component
 * 
 * Displays when there's no data to show.
 * 
 * FEATURES:
 * - Icon/emoji
 * - Title
 * - Description
 * - Optional action button
 */

export default function EmptyState({
  icon = '📭',
  title = 'No items found',
  description,
  action,
}) {
  return (
    <div style={{
      padding: '60px 40px',
      textAlign: 'center',
      background: '#f8f9fa',
      borderRadius: '8px',
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '16px',
        lineHeight: '1',
      }}>
        {icon}
      </div>
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '18px',
        color: '#333',
        fontWeight: '600',
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          margin: '0 0 20px 0',
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.5',
        }}>
          {description}
        </p>
      )}
      {action && (
        <div style={{ marginTop: '24px' }}>
          {action}
        </div>
      )}
    </div>
  )
}
