import { useState } from 'react';

interface PaymentButtonProps {
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  price: string;
  asset: string;
  onPaymentComplete: (proof: string) => void;
  onError?: (error: string) => void;
}

export function PaymentButton({
  tier,
  price,
  asset,
  onPaymentComplete,
  onError
}: PaymentButtonProps) {
  const [paying, setPaying] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  async function handlePayment() {
    setPaying(true);
    
    try {
      // In production, this would:
      // 1. Open wallet connection
      // 2. Create payment transaction
      // 3. Sign and send transaction
      // 4. Get transaction signature
      
      // Simulated payment flow
      const proof = await simulatePayment(price, asset);
      setPaymentProof(proof);
      onPaymentComplete(proof);
    } catch (error: any) {
      onError?.(error.message);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="x402-payment">
      {!paymentProof ? (
        <div className="payment-required">
          <h3>🔒 Payment Required</h3>
          <p>This {tier} content requires payment</p>
          
          <div className="price-display">
            <span className="amount">{price}</span>
            <span className="asset">{asset.toUpperCase()}</span>
            <span className="tier">/{tier}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={paying}
            className="pay-button"
          >
            {paying ? (
              <span className="processing">🔄 Processing...</span>
            ) : (
              <span className="pay">💳 Pay {price} {asset.toUpperCase()}</span>
            )}
          </button>

          <p className="secure-notice">
            🔒 Secure payment via x402 protocol
          </p>
          
          <div className="supported-assets">
            <span>Supported:</span>
            <span className="asset-tag">USDC</span>
            <span className="asset-tag">SOL</span>
            <span className="asset-tag">ETH</span>
          </div>
        </div>
      ) : (
        <div className="payment-complete">
          <h3>✅ Payment Verified</h3>
          <p>Transaction: {paymentProof.slice(0, 20)}...</p>
          <p className="ready">Your {tier} access is now active!</p>
        </div>
      )}
    </div>
  );
}

// Simulated payment (replace with real wallet integration)
async function simulatePayment(amount: string, asset: string): Promise<string> {
  // Simulate wallet interaction delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In production, this would:
  // 1. Connect to wallet (Phantom, Solflare, etc.)
  // 2. Create transfer instruction
  // 3. Get user signature
  // 4. Send transaction
  // 5. Return transaction signature
  
  // Return mock proof
  return Buffer.from(JSON.stringify({
    protocol: 'x402',
    version: '1.0',
    transaction: `simulated_tx_${Date.now()}`,
    signature: '9a' + 'x'.repeat(88) + 'z',
    block: 123456789,
    amount,
    asset,
    timestamp: Date.now()
  })).toString('base64');
}

// Payment tier selector component
interface PricingSelectorProps {
  selected: string;
  onSelect: (tier: string) => void;
}

export function PricingSelector({ selected, onSelect }: PricingSelectorProps) {
  const tiers = [
    { id: 'free', name: 'Free', price: '0', features: ['1 artwork/day'] },
    { id: 'basic', name: 'Basic', price: '0.001', features: ['10 artworks/day'] },
    { id: 'pro', name: 'Pro', price: '0.01', features: ['100 artworks/day', 'Collaboration'] },
    { id: 'enterprise', name: 'Enterprise', price: '0.1', features: ['Unlimited', 'API access'] }
  ];

  return (
    <div className="pricing-selector">
      <h3>Choose Your Plan</h3>
      <div className="tiers">
        {tiers.map(tier => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier.id)}
            className={`tier-card ${selected === tier.id ? 'selected' : ''}`}
          >
            <h4>{tier.name}</h4>
            <div className="price">{tier.price} USDC</div>
            <ul className="features">
              {tier.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
