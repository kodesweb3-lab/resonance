/**
 * x402 Payment Integration for RESONANCE
 * 
 * x402 is an HTTP-native payment protocol using 402 status code.
 * https://x402.org
 */

// Payment configuration
const PAYMENT_CONFIG = {
  // Wallet addresses for different chains
  solana: {
    wallet: '94DqLR6QLxwpw4uprxaDkfcFNgq1forzVK7jGuezsh2Z',
    asset: 'usdc',
    decimals: 6
  },
  base: {
    wallet: '0x0000000000000000000000000000000000000001',
    asset: 'usdc',
    decimals: 6
  },
  ethereum: {
    wallet: '0x0000000000000000000000000000000000000001',
    asset: 'usdc',
    decimals: 6
  }
};

// Pricing tiers
export const PRICING = {
  free: {
    artworksPerDay: 1,
    price: '0',
    features: ['Preview mode']
  },
  basic: {
    artworksPerDay: 10,
    price: '0.001', // USDC
    features: ['10 artworks/day', 'Standard quality']
  },
  pro: {
    artworksPerDay: 100,
    price: '0.01', // USDC
    features: ['100 artworks/day', 'High quality', 'Collaboration']
  },
  enterprise: {
    artworksPerDay: Infinity,
    price: '0.1', // USDC
    features: ['Unlimited', 'API access', 'Custom models', 'Priority']
  }
};

// Create 402 Payment Required response
export function createPaymentRequired(
  tier: keyof typeof PRICING = 'basic'
): Response {
  const config = PAYMENT_CONFIG.solana;
  const price = PRICING[tier];
  
  return new Response(JSON.stringify({
    status: 402,
    payment: {
      protocol: 'x402',
      version: '1.0',
      recipient: config.wallet,
      asset: config.asset,
      amount: price.price,
      description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} RESONANCE Access - ${price.features.join(', ')}`,
      acceptable_assets: ['usdc', 'sol', 'eth'],
      chains: ['solana', 'base', 'ethereum'],
      payment_url: `https://x402.org/pay?recipient=${config.wallet}&asset=${config.asset}&amount=${price.price}`
    },
    pricing: PRICING,
    message: 'Payment required to access this resource'
  }), {
    status: 402,
    headers: {
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'x402 realm="RESONANCE"'
    }
  });
}

// Verify x402 payment proof
export async function verifyPayment(
  proof: string,
  expectedAmount: string,
  chain: 'solana' | 'base' | 'ethereum' = 'solana'
): Promise<boolean> {
  try {
    const config = PAYMENT_CONFIG[chain];
    
    // Parse proof (simplified - real implementation would verify on-chain)
    const paymentData = JSON.parse(atob(proof));
    
    // Verify transaction
    const verified = await verifyOnChain(
      paymentData.signature,
      config.wallet,
      expectedAmount,
      chain
    );
    
    return verified;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
}

// On-chain payment verification
async function verifyOnChain(
  signature: string,
  recipient: string,
  amount: string,
  chain: string
): Promise<boolean> {
  // In production, this would verify the actual transaction
  // For now, return true if proof is valid format
  return signature.length > 50;
}

// Create x402 payment header for requests
export function createPaymentHeader(
  tier: keyof typeof PRICING
): string {
  const config = PAYMENT_CONFIG.solana;
  const price = PRICING[tier];
  
  return Buffer.from(JSON.stringify({
    protocol: 'x402',
    recipient: config.wallet,
    asset: config.asset,
    amount: price.price,
    timestamp: Date.now()
  })).toString('base64');
}

// Check if request has valid payment
export async function checkPayment(
  request: Request,
  requiredTier: keyof typeof PRICING = 'basic'
): Promise<{ authorized: boolean; response?: Response }> {
  const proof = request.headers.get('x402-proof');
  
  if (!proof) {
    return { authorized: false, response: createPaymentRequired(requiredTier) };
  }
  
  const price = PRICING[requiredTier].price;
  const verified = await verifyPayment(proof, price);
  
  if (!verified) {
    return { 
      authorized: false, 
      response: new Response(JSON.stringify({
        status: 402,
        error: 'Invalid payment proof'
      }), { status: 402 }) 
    };
  }
  
  return { authorized: true };
}

// Middleware for x402 payment protection
export function x402Middleware(
  requiredTier: keyof typeof PRICING = 'basic'
): (request: Request) => Promise<Response | null> {
  return async (request: Request): Promise<Response | null> => {
    const result = await checkPayment(request, requiredTier);
    return result.response || null;
  };
}

// Export config for external use
export function getPaymentConfig() {
  return PAYMENT_CONFIG;
}

export function getPricing() {
  return PRICING;
}
