/**
 * UI Component Library - Examples & Demo
 * 
 * This file demonstrates all UI components in action.
 * Use this as a reference for implementing UI components throughout the app.
 */

import { useState } from 'react'
import Button from './Button'
import Card from './Card'
import Badge from './Badge'
import Input from './Input'
import Select from './Select'
import Modal from './Modal'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

export default function UIExamples() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('option1')

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '40px' }}>UI Component Library Examples</h1>

      {/* Buttons Section */}
      <Card style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0 }}>Buttons</h2>
        
        <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>States</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>

        <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>Full Width</h3>
        <Button fullWidth>Full Width Button</Button>
      </Card>

      {/* Badges Section */}
      <Card style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0 }}>Badges</h2>
        
        <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">✓ Success</Badge>
          <Badge variant="danger">✗ Danger</Badge>
          <Badge variant="warning">⏰ Warning</Badge>
          <Badge variant="info">ℹ Info</Badge>
          <Badge variant="secondary">Secondary</Badge>
        </div>

        <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </Card>

      {/* Cards Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px' }}>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <Card padding="sm">
            <h3 style={{ margin: '0 0 8px 0' }}>Small Padding</h3>
            <p style={{ margin: 0, color: '#666' }}>This card has small padding</p>
          </Card>
          <Card padding="md">
            <h3 style={{ margin: '0 0 8px 0' }}>Medium Padding</h3>
            <p style={{ margin: 0, color: '#666' }}>This is the default padding</p>
          </Card>
          <Card padding="lg" hover>
            <h3 style={{ margin: '0 0 8px 0' }}>Large Padding + Hover</h3>
            <p style={{ margin: 0, color: '#666' }}>Hover over this card!</p>
          </Card>
        </div>
      </div>

      {/* Form Components Section */}
      <Card style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0 }}>Form Components</h2>
        
        <Input
          label="Text Input"
          placeholder="Enter text..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          helpText="This is help text"
        />
        
        <Input
          label="Email Input"
          type="email"
          placeholder="user@example.com"
          required
        />
        
        <Input
          label="Input with Error"
          error="This field has an error"
          placeholder="Invalid input"
        />
        
        <Select
          label="Select Dropdown"
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          helpText="Choose an option from the dropdown"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
      </Card>

      {/* Modal Section */}
      <Card style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0 }}>Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p>This is a modal dialog with title, content, and footer actions.</p>
          <p>Click the backdrop or press Escape to close.</p>
        </Modal>
      </Card>

      {/* Loading Spinner Section */}
      <Card style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0 }}>Loading Spinner</h2>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <LoadingSpinner size="sm" />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Small</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <LoadingSpinner size="md" message="Loading..." />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Medium with message</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <LoadingSpinner size="lg" />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Large</div>
          </div>
        </div>
      </Card>

      {/* Empty State Section */}
      <Card style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0 }}>Empty State</h2>
        
        <EmptyState
          icon="📭"
          title="No items found"
          description="This is what users see when there's no data to display."
          action={
            <Button>Add First Item</Button>
          }
        />
      </Card>

      {/* Real-World Examples */}
      <Card>
        <h2 style={{ marginTop: 0 }}>Real-World Example: Proposal Card</h2>
        
        <Card hover padding="lg" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>Proposal #5</h3>
              <Badge variant="success">✓ Active</Badge>
            </div>
            <Badge variant="info">🗳️ 12 votes</Badge>
          </div>
          
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Should we hire a full-time developer for the DAO?
          </p>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="success" size="sm">👍 Vote FOR</Button>
            <Button variant="danger" size="sm">👎 Vote AGAINST</Button>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </Card>

        <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
          ↑ This entire card is built using reusable UI components!
        </p>
      </Card>
    </div>
  )
}
