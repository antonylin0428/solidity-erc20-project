/**
 * OrganizationFilters Component
 * 
 * Provides filtering options for organizations:
 * - Search by name or creator address
 * - Sort by date, name
 * - Filter by creator (my organizations)
 */

import { useState } from 'react'

export default function OrganizationFilters({ filters, onFiltersChange, userAddress }) {
  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      sortBy: 'newest',
      showOnlyMine: false,
    })
  }

  const hasActiveFilters = filters.searchTerm || filters.sortBy !== 'newest' || filters.showOnlyMine

  return (
    <div style={{
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
      }}>
        🔍 Find Organizations
      </h3>

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
          placeholder="Search by name or creator address..."
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
          <option value="name">Alphabetical (A-Z)</option>
          <option value="nameDesc">Alphabetical (Z-A)</option>
        </select>
      </div>

      {/* Show Only Mine (if connected) */}
      {userAddress && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          background: '#f8f9fa',
          borderRadius: '6px',
          marginBottom: hasActiveFilters ? '16px' : 0,
        }}>
          <input
            type="checkbox"
            id="showOnlyMine"
            checked={filters.showOnlyMine}
            onChange={(e) => handleChange('showOnlyMine', e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer',
            }}
          />
          <label
            htmlFor="showOnlyMine"
            style={{
              fontSize: '14px',
              color: '#333',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            Show only my organizations
          </label>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={{
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
