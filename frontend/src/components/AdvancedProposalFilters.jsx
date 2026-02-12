/**
 * AdvancedProposalFilters Component
 * 
 * Provides comprehensive filtering options for proposals:
 * - Search by description
 * - Filter by status
 * - Sort by various criteria
 * - Filter by action type
 * - Filter by proposer
 * - Show only voted proposals
 */

import { useState } from 'react'

export default function AdvancedProposalFilters({ filters, onFiltersChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      status: 'all',
      sortBy: 'newest',
      actionType: 'all',
      showOnlyVoted: false,
    })
  }

  const hasActiveFilters = filters.searchTerm || filters.status !== 'all' || 
    filters.sortBy !== 'newest' || filters.actionType !== 'all' || filters.showOnlyVoted

  return (
    <div style={{
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      {/* Header with toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
          🔍 Filter & Search
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: '6px 12px',
            background: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#667eea',
            fontWeight: '600',
          }}
        >
          {showAdvanced ? '▲ Hide Advanced' : '▼ Show Advanced'}
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '6px',
        }}>
          Search
        </label>
        <input
          type="text"
          placeholder="Search proposals by description or keywords..."
          value={filters.searchTerm}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      {/* Status Filter Pills */}
      <div style={{ marginBottom: showAdvanced ? '16px' : 0 }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px',
        }}>
          Status
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'active', 'passed', 'failed', 'executed'].map((status) => (
            <button
              key={status}
              onClick={() => handleChange('status', status)}
              style={{
                padding: '8px 16px',
                background: filters.status === status ? '#667eea' : '#f8f9fa',
                color: filters.status === status ? 'white' : '#333',
                border: filters.status === status ? '2px solid #667eea' : '2px solid #e9ecef',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: filters.status === status ? 'bold' : '600',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={{
          paddingTop: '16px',
          borderTop: '1px solid #e9ecef',
          marginTop: '16px',
        }}>
          {/* Sort By */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#666',
              marginBottom: '6px',
            }}>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostVotes">Most Votes</option>
              <option value="leastVotes">Least Votes</option>
              <option value="closingFirst">Ending Soonest</option>
            </select>
          </div>

          {/* Action Type Filter */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#666',
              marginBottom: '6px',
            }}>
              Action Type
            </label>
            <select
              value={filters.actionType}
              onChange={(e) => handleChange('actionType', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Types</option>
              <option value="text">Text Only</option>
              <option value="payment">Payment</option>
              <option value="settings">Settings Change</option>
              <option value="member">Member Management</option>
            </select>
          </div>

          {/* Show Only Voted */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '6px',
          }}>
            <input
              type="checkbox"
              id="showOnlyVoted"
              checked={filters.showOnlyVoted}
              onChange={(e) => handleChange('showOnlyVoted', e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="showOnlyVoted"
              style={{
                fontSize: '14px',
                color: '#333',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              Show only proposals I voted on
            </label>
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#fff',
            color: '#dc3545',
            border: '1px solid #dc3545',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            width: '100%',
          }}
        >
          ✕ Clear All Filters
        </button>
      )}
    </div>
  )
}
