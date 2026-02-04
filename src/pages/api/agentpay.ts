/**
 * AgentPay Integration for RESONANCE
 * 
 * AgentPay allows AI agents to accept payments for their services.
 * Integration flow:
 * 1. Register service with AgentPay
 * 2. When user requests art, create payment stream
 * 3. User pays via AgentPay
 * 4. AgentPay records call
 * 5. Service delivers art
 */

interface AgentPayConfig {
  endpoint: string;
  serviceName: string;
  pricePerCall: number; // in lamports
}

interface PaymentRequest {
  serviceId: string;
  userId: string;
  artType: string;
}

interface PaymentResponse {
  success: boolean;
  streamId?: string;
  paymentUrl?: string;
}

class AgentPayIntegration {
  private endpoint: string = '';
  private serviceId: string = '';
  private wallet: string = '94DqLR6QLxwpw4uprxaDkfcFNgq1forzVK7jGuezsh2Z';
  
  constructor() {
    // Endpoint will be set when antigravity provides working URL
  }

  /**
   * Set the AgentPay endpoint (when available)
   */
  setEndpoint(url: string): void {
    this.endpoint = url;
  }

  /**
   * Register RESONANCE as a service with AgentPay
   */
  async registerService(name: string, description: string): Promise<boolean> {
    if (!this.endpoint) {
      console.log('⚠️ AgentPay endpoint not available yet');
      return false;
    }

    try {
      const response = await fetch(`${this.endpoint}/api/services/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          pricePerCall: 100000, // 0.0001 SOL per art generation
          endpoint: 'https://resonance-production.up.railway.app/api/generate',
          wallet: this.wallet
        })
      });

      const data = await response.json();
      if (data.success) {
        this.serviceId = data.serviceId;
        console.log(`✅ Registered: ${name} (ID: ${this.serviceId})`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return false;
    }
  }

  /**
   * Create a payment stream for art generation
   */
  async createPaymentStream(userId: string, artType: string): Promise<PaymentResponse> {
    if (!this.endpoint || !this.serviceId) {
      return { success: false };
    }

    try {
      const response = await fetch(`${this.endpoint}/api/streams/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: this.serviceId,
          userId,
          artType,
          amount: 100000 // lamports
        })
      });

      const data = await response.json();
      return {
        success: data.success,
        streamId: data.streamId,
        paymentUrl: data.paymentUrl
      };
    } catch (error) {
      console.error('❌ Payment stream failed:', error);
      return { success: false };
    }
  }

  /**
   * Verify payment and deliver art
   */
  async verifyAndDeliver(streamId: string, artPrompt: string): Promise<boolean> {
    if (!this.endpoint) return false;

    try {
      const response = await fetch(`${this.endpoint}/api/streams/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamId })
      });

      const data = await response.json();
      if (data.verified) {
        // Generate and deliver art
        console.log(`🎨 Generating art: ${artPrompt}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Verification failed:', error);
      return false;
    }
  }

  /**
   * Get wallet for receiving payments
   */
  getWallet(): string {
    return this.wallet;
  }
}

// Export singleton instance
export const agentPay = new AgentPayIntegration();

// API endpoint for RESONANCE
export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'POST') {
    const { action, userId, artPrompt, artType } = await req.json();

    switch (action) {
      case 'register':
        const registered = await agentPay.registerService(
          'RESONANCE Art Collective',
          'AI-generated art from autonomous artists'
        );
        return Response.json({ success: registered });

      case 'create_payment':
        const payment = await agentPay.createPaymentStream(userId, artType || 'visual');
        return Response.json(payment);

      case 'generate':
        const streamId = new URL(req.url).searchParams.get('streamId');
        if (!streamId) {
          return Response.json({ error: 'streamId required' }, { status: 400 });
        }
        const delivered = await agentPay.verifyAndDeliver(streamId, artPrompt);
        return Response.json({ success: delivered });

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  }

  return Response.json({ 
    message: 'AgentPay Integration Ready',
    wallet: agentPay.getWallet(),
    endpoint: 'Awaiting AgentPay URL from antigravity'
  });
}
