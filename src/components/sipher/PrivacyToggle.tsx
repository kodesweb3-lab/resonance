import { useState } from 'react';

interface PrivacyToggleProps {
  onPrivacyChange: (enabled: boolean, level: 'public' | 'stealth' | 'confidential') => void;
  defaultLevel?: 'public' | 'stealth' | 'confidential';
}

export function PrivacyToggle({ 
  onPrivacyChange, 
  defaultLevel = 'public' 
}: PrivacyToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [level, setLevel] = useState(defaultLevel);

  const tiers = [
    { id: 'public', name: 'Public', fee: '0', description: 'Regular transaction' },
    { id: 'stealth', name: 'Stealth', fee: '0.0001 SOL', description: 'Stealth address + MEV protection' },
    { id: 'confidential', name: 'Confidential', fee: '0.0005 SOL', description: 'Encrypted amounts + stealth' }
  ];

  function handleToggle(checked: boolean) {
    setEnabled(checked);
    if (!checked) {
      onPrivacyChange(false, 'public');
    } else {
      onPrivacyChange(true, level);
    }
  }

  function handleLevelChange(newLevel: 'public' | 'stealth' | 'confidential') {
    setLevel(newLevel);
    if (enabled) {
      onPrivacyChange(true, newLevel);
    }
  }

  return (
    <div className="privacy-controls">
      <div className="privacy-header">
        <h3>🔒 Privacy Settings</h3>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {enabled && (
        <div className="privacy-options">
          <p className="privacy-description">
            🔒 Your transaction will be protected from MEV bots and surveillance.
          </p>

          <div className="tier-selector">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => handleLevelChange(tier.id as any)}
                className={`tier-option ${level === tier.id ? 'selected' : ''}`}
              >
                <div className="tier-name">{tier.name}</div>
                <div className="tier-fee">{tier.fee}</div>
                <div className="tier-desc">{tier.description}</div>
              </button>
            ))}
          </div>

          {level !== 'public' && (
            <div className="privacy-benefits">
              <h4>🔒 Privacy Benefits:</h4>
              <ul>
                {level === 'stealth' && (
                  <>
                    <li>✓ Stealth address (one-time)</li>
                    <li>✓ MEV protection</li>
                    <li>✓ Encrypted memos</li>
                  </>
                )}
                {level === 'confidential' && (
                  <>
                    <li>✓ All stealth benefits</li>
                    <li>✓ Amount privacy (Pedersen commitments)</li>
                    <li>✓ Full transaction encryption</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {!enabled && (
        <p className="public-notice">
          ℹ️ Public transactions are visible on-chain. 
          Enable privacy to protect your transactions.
        </p>
      )}
    </div>
  );
}

// Stealth address display component
interface StealthAddressDisplayProps {
  address: string;
  viewingKey: string;
  onCopy: () => void;
}

export function StealthAddressDisplay({ 
  address, 
  viewingKey, 
  onCopy 
}: StealthAddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(`${address}|${viewingKey}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy();
  }

  return (
    <div className="stealth-address">
      <h4>🔒 Your Stealth Address</h4>
      
      <div className="address-field">
        <label>Address:</label>
        <code>{address}</code>
        <button onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      <div className="viewing-key-field">
        <label>Viewing Key (keep secret):</label>
        <code>{viewingKey}</code>
      </div>

      <p className="warning">
        ⚠️ The viewing key is needed to spend from this address. 
        Store it securely!
      </p>
    </div>
  );
}

// Privacy status badge
export function PrivacyStatusBadge() {
  const [status, setStatus] = useState<'checking' | 'active' | 'inactive'>('checking');

  useState(() => {
    // Check Sipher status on mount
    fetch('/api/sipher')
      .then(res => res.json())
      .then(data => {
        setStatus(data.sipher?.status === 'active' ? 'active' : 'inactive');
      })
      .catch(() => {
        setStatus('inactive');
      });
  });

  return (
    <span className={`privacy-status ${status}`}>
      {status === 'checking' && '🔄 Checking...'}
      {status === 'active' && '🔒 Private'}
      {status === 'inactive' && '🔓 Public'}
    </span>
  );
}
