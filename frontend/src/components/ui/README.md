# UI Component Library

A comprehensive, reusable component library for the DAO platform.

---

## 📦 Components

### Button
Reusable button with multiple variants and sizes.

**Import:**
```javascript
import { Button } from './components/ui'
```

**Usage:**
```javascript
// Primary button (default)
<Button onClick={handleClick}>Click Me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// Disabled
<Button disabled>Disabled</Button>

// With icon
<Button>👍 Vote FOR</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `fullWidth`: boolean
- `onClick`: function
- `type`: 'button' | 'submit' | 'reset'

---

### Card
Reusable container component with hover effects.

**Import:**
```javascript
import { Card } from './components/ui'
```

**Usage:**
```javascript
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// With padding control
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>
<Card padding="none">No padding</Card>

// Hover effect
<Card hover>
  Lifts on hover
</Card>

// Clickable card
<Card onClick={handleClick}>
  Click me!
</Card>

// Custom styles
<Card style={{ background: '#f0f0f0' }}>
  Custom styled card
</Card>
```

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hover`: boolean
- `onClick`: function
- `style`: object (additional styles)

---

### Badge
Small status indicator with color variants.

**Import:**
```javascript
import { Badge } from './components/ui'
```

**Usage:**
```javascript
// Variants
<Badge variant="success">✓ Active</Badge>
<Badge variant="danger">✗ Failed</Badge>
<Badge variant="warning">⏰ Pending</Badge>
<Badge variant="info">ℹ Info</Badge>
<Badge variant="secondary">Neutral</Badge>
<Badge variant="primary">Primary</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With icons
<Badge variant="success">✓ Passed</Badge>
<Badge variant="danger">⏱ Expired</Badge>
```

**Props:**
- `variant`: 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'primary'
- `size`: 'sm' | 'md' | 'lg'

---

### Input
Standardized input field with label and validation.

**Import:**
```javascript
import { Input } from './components/ui'
```

**Usage:**
```javascript
// Basic input
<Input
  label="Username"
  placeholder="Enter username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// With validation error
<Input
  label="Email"
  type="email"
  error="Invalid email format"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With help text
<Input
  label="Amount"
  type="number"
  helpText="Minimum: 0.001 ETH"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>

// Required field
<Input
  label="Name"
  required
  placeholder="Required field"
/>

// Different types
<Input type="text" label="Text" />
<Input type="email" label="Email" />
<Input type="number" label="Number" />
<Input type="password" label="Password" />
```

**Props:**
- `label`: string
- `error`: string (error message)
- `helpText`: string
- `fullWidth`: boolean (default: true)
- `type`: standard HTML input types
- All standard input props (value, onChange, placeholder, etc.)

---

### Select
Standardized dropdown field with label.

**Import:**
```javascript
import { Select } from './components/ui'
```

**Usage:**
```javascript
// Basic select
<Select
  label="Choose an option"
  value={selected}
  onChange={(e) => setSelected(e.target.value)}
>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <option value="option3">Option 3</option>
</Select>

// With validation error
<Select
  label="Status"
  error="Please select a status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="">Select...</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</Select>

// With help text
<Select
  label="Voting Period"
  helpText="How long members can vote"
  value={period}
  onChange={(e) => setPeriod(e.target.value)}
>
  <option value="3">3 days</option>
  <option value="7">7 days</option>
  <option value="14">14 days</option>
</Select>
```

**Props:**
- `label`: string
- `error`: string (error message)
- `helpText`: string
- `fullWidth`: boolean (default: true)
- All standard select props (value, onChange, etc.)

---

### Modal
Reusable modal/dialog with overlay.

**Import:**
```javascript
import { Modal } from './components/ui'
```

**Usage:**
```javascript
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </>
  )
}

// Simple modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Information"
>
  <p>Modal content goes here</p>
</Modal>

// Custom width
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Large Modal"
  maxWidth="900px"
>
  <p>Wide modal content</p>
</Modal>
```

**Props:**
- `isOpen`: boolean (required)
- `onClose`: function (required)
- `title`: string
- `footer`: ReactNode (footer buttons)
- `maxWidth`: string (default: '600px')

**Features:**
- Close on Escape key
- Close on backdrop click
- Prevents body scroll when open
- Smooth animations
- Centered on screen

---

### LoadingSpinner
Animated loading indicator.

**Import:**
```javascript
import { LoadingSpinner } from './components/ui'
```

**Usage:**
```javascript
// Basic spinner
<LoadingSpinner />

// With message
<LoadingSpinner message="Loading proposals..." />

// Sizes
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />

// Variants
<LoadingSpinner variant="primary" />
<LoadingSpinner variant="white" /> {/* For dark backgrounds */}

// Full page overlay
<LoadingSpinner fullPage message="Please wait..." />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'primary' | 'white'
- `message`: string
- `fullPage`: boolean (creates overlay)

---

### EmptyState
Displays when there's no data.

**Import:**
```javascript
import { EmptyState } from './components/ui'
```

**Usage:**
```javascript
// Basic empty state
<EmptyState
  icon="📭"
  title="No proposals yet"
  description="Create the first proposal to get started!"
/>

// With action button
<EmptyState
  icon="👥"
  title="No members yet"
  description="Start building your community by adding members."
  action={
    <Button onClick={handleAddMember}>
      Add First Member
    </Button>
  }
/>

// Different icons
<EmptyState icon="🔍" title="No results found" />
<EmptyState icon="⚠️" title="Access denied" />
<EmptyState icon="🔒" title="Members only" />
```

**Props:**
- `icon`: string (emoji or icon)
- `title`: string
- `description`: string
- `action`: ReactNode (optional button or link)

---

## 🎨 Design System

### Color Palette

```javascript
const colors = {
  primary: '#667eea',      // Purple - main brand color
  secondary: '#6c757d',    // Gray - neutral actions
  success: '#28a745',      // Green - positive states
  danger: '#dc3545',       // Red - destructive actions
  warning: '#ffc107',      // Yellow - warnings
  info: '#17a2b8',         // Cyan - informational
  
  // Grays
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#6c757d',
  gray600: '#495057',
  gray700: '#343a40',
}
```

### Typography

```javascript
const typography = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  
  sizes: {
    xs: '11px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}
```

### Spacing Scale

```javascript
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
}
```

### Border Radius

```javascript
const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  pill: '9999px',
}
```

---

## 📚 Usage Patterns

### Form with Components

```javascript
import { Card, Input, Select, Button } from './components/ui'

function MyForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState('option1')
  const [error, setError] = useState('')

  return (
    <Card>
      <h2>Form Title</h2>
      
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        required
      />
      
      <Select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
      
      <Button fullWidth variant="primary" type="submit">
        Submit
      </Button>
    </Card>
  )
}
```

### Modal with Actions

```javascript
import { Modal, Button } from './components/ui'

function ConfirmDialog({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Action"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </>
      }
    >
      <p>Are you sure you want to proceed?</p>
    </Modal>
  )
}
```

### Status Display

```javascript
import { Card, Badge } from './components/ui'

function ProposalStatus({ proposal }) {
  return (
    <Card>
      <h3>Proposal #{proposal.id}</h3>
      <Badge variant={proposal.passed ? 'success' : 'danger'}>
        {proposal.passed ? '✓ Passed' : '✗ Failed'}
      </Badge>
    </Card>
  )
}
```

---

## 🎯 Benefits

### Consistency
- All buttons look and behave the same
- Uniform spacing and colors
- Cohesive user experience

### Maintainability
- Change design once, updates everywhere
- Easy to refactor
- Clear component API

### Productivity
- Build features faster
- Less custom styling
- Reuse proven patterns

### Quality
- Tested components
- Accessible by default
- Better than inline styles

---

## 🚀 Migration Guide

### Before (Inline Styles):
```javascript
<button
  onClick={handleClick}
  style={{
    padding: '12px 24px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }}
>
  Click Me
</button>
```

### After (Component):
```javascript
<Button onClick={handleClick}>
  Click Me
</Button>
```

**Result:**
- 90% less code
- Consistent styling
- Built-in hover effects
- Easier to maintain

---

## 🎨 Design Principles

### 1. **Composition Over Configuration**
Components are simple and composable:
```javascript
<Card>
  <Badge variant="success">Active</Badge>
  <h3>Title</h3>
  <Button>Action</Button>
</Card>
```

### 2. **Sensible Defaults**
Works out of the box:
```javascript
<Button>Click Me</Button>  // Uses primary variant, md size
```

### 3. **Flexible Styling**
Can override when needed:
```javascript
<Card style={{ background: '#f0f0f0' }}>
  Custom background
</Card>
```

### 4. **Consistent API**
Similar props across components:
- All have `variant` for color
- All have `size` for dimensions
- All support `...props` spreading

---

## 📊 Component Sizes

| Component | Lines of Code | Variants | Sizes |
|-----------|---------------|----------|-------|
| Button | 130 | 6 | 3 |
| Card | 70 | 1 | 4 paddings |
| Badge | 85 | 6 | 3 |
| Input | 90 | 1 | 1 |
| Select | 95 | 1 | 1 |
| Modal | 160 | 1 | Custom width |
| LoadingSpinner | 80 | 2 | 3 |
| EmptyState | 60 | 1 | 1 |
| **Total** | **770 lines** | **19 variants** | **Multiple sizes** |

---

## 🧪 Testing Components

### Example Test:
```javascript
import { render, screen } from '@testing-library/react'
import { Button } from './components/ui'

it('should render button with text', () => {
  render(<Button>Click Me</Button>)
  expect(screen.getByText('Click Me')).toBeInTheDocument()
})

it('should handle click events', async () => {
  const handleClick = vi.fn()
  const user = userEvent.setup()
  
  render(<Button onClick={handleClick}>Click</Button>)
  await user.click(screen.getByText('Click'))
  
  expect(handleClick).toHaveBeenCalledOnce()
})
```

---

## 🔮 Future Enhancements

### Additional Components:
- **Tooltip** - Hover information
- **Dropdown** - Menu component
- **Tabs** - Tab navigation
- **Alert** - Banner notifications
- **Checkbox** - Styled checkboxes
- **Radio** - Styled radio buttons
- **Toggle** - Switch component
- **Avatar** - User avatars
- **Skeleton** - Loading placeholders
- **Progress** - Progress bars

### Theme Support:
- Dark mode
- Custom color schemes
- User preferences

---

## ✨ Quick Reference

### Import Everything:
```javascript
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Modal,
  LoadingSpinner,
  EmptyState,
} from './components/ui'
```

### Common Patterns:

**Form:**
```javascript
<Card>
  <Input label="Name" />
  <Select label="Type">
    <option>Option</option>
  </Select>
  <Button fullWidth>Submit</Button>
</Card>
```

**Status Display:**
```javascript
<Card>
  <Badge variant="success">Active</Badge>
  <h3>Title</h3>
</Card>
```

**Loading State:**
```javascript
{isLoading ? (
  <LoadingSpinner message="Loading..." />
) : (
  <Content />
)}
```

**Empty State:**
```javascript
{items.length === 0 ? (
  <EmptyState
    icon="📭"
    title="No items"
    description="Get started by adding an item"
  />
) : (
  <ItemList />
)}
```

---

## 🎓 Best Practices

### 1. **Use Components Consistently**
✅ Always use UI components instead of inline styles
✅ Maintain design system integrity

### 2. **Don't Override Too Much**
✅ Use variants and sizes when possible
❌ Avoid excessive custom styling

### 3. **Compose Thoughtfully**
✅ Combine components naturally
✅ Think about hierarchy and spacing

### 4. **Test Components**
✅ Test UI components in isolation
✅ Ensure they work in different contexts

---

This library provides a solid foundation for building consistent, maintainable UIs across your entire DAO platform! 🚀
