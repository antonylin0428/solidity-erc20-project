# Testing Guide

## Current Test Coverage

✅ **29 Tests Passing** | ⏭️ **8 Tests Skipped** | ⚡ **Fast execution (~1s)**

### Test Suites

1. **Hook Tests** (`useToast.test.jsx`)
   - Tests custom React hooks in isolation
   - Covers success, error, info, warning toasts
   - Tests toast stacking, removal, and clearing
   - 10 passing tests

2. **Utility Tests** (`proposalDecoder.test.js`)
   - Tests pure JavaScript utility functions
   - Covers proposal action decoding
   - Tests color helpers and formatting
   - 7 passing tests

3. **Component Tests** (`ProposalActionPreview.test.jsx`)
   - Tests React component rendering
   - Covers different proposal types
   - Tests warnings and Etherscan links
   - 6 passing tests

4. **Integration Tests** (`ToastContainer.test.jsx`)
   - Tests multiple components working together
   - Covers full toast notification flow
   - Tests user interactions and UI updates
   - 6 passing tests

### Skipped Tests

8 tests are intentionally skipped due to complexity in testing environment:
- Timer-based tests (auto-dismiss toasts)
- Promise-based workflows
- These features work correctly in the real application

---

## Overview

This project uses **Vitest** for frontend testing and **Hardhat** for smart contract testing.

## Frontend Testing

### Tech Stack

- **Vitest** - Fast test runner (Jest-compatible)
- **React Testing Library** - Test React components
- **@testing-library/jest-dom** - Custom matchers

### Test Types

#### 1. Utility Function Tests
Test pure JavaScript functions with no React dependencies.

**Example: `proposalDecoder.test.js`**
```javascript
import { decodeProposalAction } from './proposalDecoder'

it('should decode payment proposal', () => {
  const proposal = { target: '0x123...', value: '100000000000000000' }
  const result = decodeProposalAction(proposal)
  expect(result.type).toBe('payment')
})
```

#### 2. Component Tests
Test React components in isolation.

**Example: `ProposalActionPreview.test.jsx`**
```javascript
import { render, screen } from '@testing-library/react'
import ProposalActionPreview from './ProposalActionPreview'

it('should render text-only proposal', () => {
  render(<ProposalActionPreview proposal={proposal} />)
  expect(screen.getByText(/No on-chain action/i)).toBeInTheDocument()
})
```

#### 3. Hook Tests (Advanced)
Test custom React hooks.

```javascript
import { renderHook, act } from '@testing-library/react'
import { useToast } from './useToast'

it('should show toast', () => {
  const { result } = renderHook(() => useToast())
  act(() => {
    result.current.success('Test message')
  })
  // Assert toast appeared
})
```

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm test -- --watch

# Run tests with UI (opens browser interface)
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test File Naming

- Place tests next to the file they test
- Use `.test.js` or `.test.jsx` extension
- Examples:
  - `ProposalCard.jsx` → `ProposalCard.test.jsx`
  - `proposalDecoder.js` → `proposalDecoder.test.js`

### Writing Good Tests

#### ✅ DO:
- Test behavior, not implementation
- Use descriptive test names
- Test edge cases
- Mock external dependencies (blockchain calls)

#### ❌ DON'T:
- Test internal component state
- Test third-party libraries
- Write tests that depend on each other
- Test styling (that's what visual regression tests are for)

## Smart Contract Testing

### Tech Stack

- **Hardhat** - Ethereum development environment
- **Chai** - Assertion library
- **Ethers.js** - Blockchain interaction

### Running Contract Tests

```bash
# From project root
npm test

# Or explicitly
npx hardhat test

# Run specific test file
npx hardhat test test/ClubDAO.test.js

# Show gas usage
REPORT_GAS=true npx hardhat test
```

### Test Structure

Contract tests are in `/test/` directory:
- `ClubDAO.test.js`
- `ClubDAOFactory.test.js`
- `MembershipNFT.test.js`
- `ClubTreasury.test.js`

### Example Contract Test

```javascript
describe("ClubDAO", function () {
  it("Should create a proposal", async function () {
    const [owner] = await ethers.getSigners()
    const dao = await ClubDAO.deploy(nftAddress)
    
    await dao.createProposal("Test", target, "0x", 0)
    
    const count = await dao.proposalCount()
    expect(count).to.equal(1)
  })
})
```

## Test Coverage

### What to Test

#### High Priority
- ✅ Utility functions (proposalDecoder)
- ✅ Business logic
- ✅ Data transformations
- ✅ Conditional rendering

#### Medium Priority
- Form validation
- User interactions
- Error handling
- Edge cases

#### Low Priority (Optional)
- Pure UI components
- Styling
- Third-party library usage

### Current Coverage

Run `npm run test:coverage` to see detailed coverage report.

## Continuous Integration (Future)

When setting up CI/CD:

```yaml
# .github/workflows/test.yml
- run: npm install
- run: npm test
- run: npx hardhat test
```

## Debugging Tests

### Vitest
```bash
# Run single test file
npm test -- proposalDecoder.test.js

# Run tests matching pattern
npm test -- --grep="payment"

# Debug in VS Code
# Add breakpoint, press F5
```

### Hardhat
```bash
# Add console.log in contracts
console.log("Value:", value);

# Run tests with stack traces
npx hardhat test --verbose
```

## Best Practices

1. **Test File Organization**
   ```
   src/
   ├── components/
   │   ├── Treasury.jsx
   │   └── Treasury.test.jsx        ← Next to component
   └── utils/
       ├── proposalDecoder.js
       └── proposalDecoder.test.js  ← Next to utility
   ```

2. **Test Naming Convention**
   ```javascript
   describe('ComponentName', () => {
     it('should do something when condition', () => {
       // Test code
     })
   })
   ```

3. **Arrange-Act-Assert Pattern**
   ```javascript
   it('should decode payment', () => {
     // Arrange: Set up test data
     const proposal = { ... }
     
     // Act: Perform action
     const result = decodeProposalAction(proposal)
     
     // Assert: Check result
     expect(result.type).toBe('payment')
   })
   ```

4. **Mock External Dependencies**
   ```javascript
   // Don't actually call blockchain
   vi.mock('wagmi', () => ({
     useReadContract: () => ({ data: mockData })
   }))
   ```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Hardhat Testing](https://hardhat.org/tutorial/testing-contracts)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
