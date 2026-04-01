/**
 * LandingPage Component
 * 
 * Main landing page with hero, tutorial, and getting started guide.
 */

import { useState } from 'react'

export default function LandingPage({ onGetStarted }) {
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <div style={{
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
      }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: 'bold',
          marginBottom: '24px',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          🏛️ AgoraDAO
        </h1>
        
        <p style={{
          fontSize: '28px',
          marginBottom: '16px',
          fontWeight: '300',
          maxWidth: '800px',
          margin: '0 auto 16px auto',
        }}>
          Democracy for the digital age
        </p>
        
        <p style={{
          fontSize: '20px',
          marginBottom: '48px',
          opacity: 0.9,
          maxWidth: '700px',
          margin: '0 auto 48px auto',
        }}>
          Transparent on-chain governance for student organizations, clubs, and communities
        </p>

        <button
          onClick={onGetStarted}
          style={{
            padding: '20px 48px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >
          Launch App →
        </button>
      </div>

      {/* Main Content Container */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 20px',
      }}>
        {/* Getting Started Tutorial */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          marginBottom: '32px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#333' }}>
            🚀 Getting Started Tutorial
          </h2>
          
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
            This app runs on <strong>Sepolia Testnet</strong> (not Ethereum Mainnet). Follow these steps to get started:
          </p>

          {/* Step 1: Create Wallet */}
          <TutorialStep
            number={1}
            title="Create a Web3 Wallet"
            isExpanded={expandedSection === 'step1'}
            onToggle={() => toggleSection('step1')}
          >
            <div>
              <p style={{ marginBottom: '16px' }}>
                You need a Web3 wallet to interact with blockchain applications. We recommend MetaMask:
              </p>
              
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Visit <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>metamask.io</a></li>
                <li>Click "Download" and install the browser extension</li>
                <li>Follow the setup wizard to create a new wallet</li>
                <li>⚠️ <strong>IMPORTANT</strong>: Save your secret recovery phrase in a safe place!</li>
              </ol>

              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
              }}>
                <strong>🔒 Security Tip:</strong> Never share your secret recovery phrase with anyone. Write it down on paper and store it securely.
              </div>
            </div>
          </TutorialStep>

          {/* Step 2: Switch to Sepolia */}
          <TutorialStep
            number={2}
            title="Switch to Sepolia Testnet"
            isExpanded={expandedSection === 'step2'}
            onToggle={() => toggleSection('step2')}
          >
            <div>
              <p style={{ marginBottom: '16px' }}>
                This app uses Sepolia Testnet, a test version of Ethereum where transactions are free:
              </p>
              
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Open MetaMask extension</li>
                <li>Click the network dropdown at the top (it probably says "Ethereum Mainnet")</li>
                <li>Toggle "Show test networks" at the bottom</li>
                <li>Select <strong>"Sepolia Test Network"</strong></li>
              </ol>

              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#d4edda',
                border: '1px solid #28a745',
                borderRadius: '8px',
              }}>
                <strong>✅ Why Sepolia?</strong> It's a test network where ETH has no real value. Perfect for learning and testing without risk!
              </div>
            </div>
          </TutorialStep>

          {/* Step 3: Get Test ETH */}
          <TutorialStep
            number={3}
            title="Get Free Sepolia ETH"
            isExpanded={expandedSection === 'step3'}
            onToggle={() => toggleSection('step3')}
          >
            <div>
              <p style={{ marginBottom: '16px' }}>
                You need Sepolia ETH to pay for transactions (gas fees). Get it free from faucets:
              </p>
              
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '12px', color: '#333' }}>Recommended Faucets:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <FaucetLink
                    name="Google Sepolia Faucet"
                    url="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                    description="Requires Google account. Gives 0.05 ETH/day"
                  />
                  <FaucetLink
                    name="Alchemy Sepolia Faucet"
                    url="https://sepoliafaucet.com"
                    description="Requires Alchemy account. Fast and reliable"
                  />
                  <FaucetLink
                    name="Chainlink Sepolia Faucet"
                    url="https://faucets.chain.link/sepolia"
                    description="No account required. Simple and quick"
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ marginBottom: '12px', color: '#333' }}>How to use a faucet:</h4>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Copy your wallet address from MetaMask (click to copy at top)</li>
                  <li>Paste it into the faucet website</li>
                  <li>Complete any verification (captcha, sign-in, etc.)</li>
                  <li>Request ETH - it should arrive in 30-60 seconds</li>
                </ol>
              </div>

              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#d1ecf1',
                border: '1px solid #17a2b8',
                borderRadius: '8px',
              }}>
                <strong>💡 Tip:</strong> 0.1 Sepolia ETH is enough to create organizations and test the platform extensively!
              </div>
            </div>
          </TutorialStep>

          {/* Step 4: Launch App */}
          <TutorialStep
            number={4}
            title="Launch AgoraDAO"
            isExpanded={expandedSection === 'step4'}
            onToggle={() => toggleSection('step4')}
          >
            <div>
              <p style={{ marginBottom: '16px' }}>
                Once you have your wallet and Sepolia ETH, you're ready to go!
              </p>
              
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Click "Launch App" button above</li>
                <li>Connect your MetaMask wallet</li>
                <li>The app will automatically check if you're on Sepolia</li>
                <li>If not, it will prompt you to switch networks</li>
                <li>Start creating organizations and proposals!</li>
              </ol>

              <div style={{
                marginTop: '24px',
                padding: '24px',
                background: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <button
                  onClick={onGetStarted}
                  style={{
                    padding: '16px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#5568d3'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#667eea'
                  }}
                >
                  🎉 I'm Ready - Launch App!
                </button>
              </div>
            </div>
          </TutorialStep>
        </div>

        {/* Smart Contracts Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          marginBottom: '32px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#333' }}>
            📜 Smart Contracts
          </h2>
          
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
            All contracts are deployed on <strong>Sepolia Testnet</strong> and fully verified:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ContractCard
              name="ClubDAOFactory"
              address="0x6bdE8374C5119f61fc3730CbFBB11433cF77da06"
              description="Factory contract - creates new DAOs"
              network="sepolia"
            />
            
            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '8px',
              color: '#666',
              fontSize: '14px',
            }}>
              <strong>Note:</strong> Individual DAO and NFT contracts are created dynamically when you create a new organization. Each organization gets its own unique contract addresses.
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <a
              href="https://github.com/antonylin0428/solidity-erc20-project"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#24292e',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1a1e22'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#24292e'
              }}
            >
              📂 View Source Code on GitHub
            </a>
          </div>
        </div>

        {/* Features Preview */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          marginBottom: '32px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '32px', color: '#333', textAlign: 'center' }}>
            ✨ What You Can Do
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}>
            <FeatureCard
              icon="🎫"
              title="Create Organizations"
              description="Deploy your own DAO with NFT-based membership in seconds"
            />
            <FeatureCard
              icon="📝"
              title="Submit Proposals"
              description="Create proposals for spending, actions, or governance changes"
            />
            <FeatureCard
              icon="🗳️"
              title="Vote On-Chain"
              description="Every vote is recorded transparently on the blockchain"
            />
            <FeatureCard
              icon="💰"
              title="Manage Treasury"
              description="Collective control over funds with automatic execution"
            />
            <FeatureCard
              icon="👥"
              title="Delegate Votes"
              description="Delegate your voting power to trusted members"
            />
            <FeatureCard
              icon="⚡"
              title="Gas Optimized"
              description="60% cheaper proposals using event-based storage"
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'white',
        }}>
          <p style={{ fontSize: '18px', marginBottom: '24px', opacity: 0.9 }}>
            Ready to bring democracy to your organization?
          </p>
          <button
            onClick={onGetStarted}
            style={{
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  )
}

function TutorialStep({ number, title, isExpanded, onToggle, children }) {
  return (
    <div style={{
      marginBottom: '16px',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isExpanded ? '#f8f9fa' : 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f8f9fa'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = isExpanded ? '#f8f9fa' : 'white'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#667eea',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
          }}>
            {number}
          </div>
          <span>{title}</span>
        </div>
        <span style={{ fontSize: '24px', color: '#667eea' }}>
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      
      {isExpanded && (
        <div style={{
          padding: '24px',
          background: '#fafafa',
          borderTop: '2px solid #e0e0e0',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

function FaucetLink({ name, url, description }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '16px',
        background: '#f8f9fa',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        textDecoration: 'none',
        color: '#333',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = '#667eea'
        e.target.style.background = '#f0f3ff'
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = '#e0e0e0'
        e.target.style.background = '#f8f9fa'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#667eea' }}>
        {name} →
      </div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        {description}
      </div>
    </a>
  )
}

function ContractCard({ name, address, description, network }) {
  const etherscanUrl = `https://${network}.etherscan.io/address/${address}`
  
  return (
    <div style={{
      padding: '20px',
      background: '#f8f9fa',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '4px', color: '#333' }}>
          {name}
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          {description}
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
      }}>
        <code style={{
          flex: 1,
          padding: '8px 12px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '13px',
          fontFamily: 'monospace',
          color: '#333',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {address}
        </code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(address)
            alert('Address copied to clipboard!')
          }}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Copy
        </button>
      </div>
      
      <a
        href={etherscanUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          fontSize: '14px',
          color: '#667eea',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        View on Etherscan →
      </a>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      padding: '24px',
      background: '#f8f9fa',
      borderRadius: '12px',
      textAlign: 'center',
      transition: 'all 0.2s',
      border: '2px solid transparent',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#667eea'
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'transparent'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#333' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
        {description}
      </p>
    </div>
  )
}
