import type { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentRequired, checkPayment, getPricing } from '@/lib/x402';

// RESONANCE API with x402 Payments
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  switch (method) {
    // GET - Check pricing and payment requirements
    case 'GET': {
      const pricing = getPricing();
      
      return res.status(200).json({
        service: 'RESONANCE AI Art Collective',
        payment_protocol: 'x402',
        version: '1.0',
        pricing,
        payment_address: '94DqLR6QLxwpw4uprxaDkfcFNgq1forzVK7jGuezsh2Z',
        accepted_assets: ['usdc', 'sol'],
        chains: ['solana'],
        documentation: 'https://x402.org/docs',
        example: {
          free: {
            artworks: 1,
            endpoint: '/api/generate?artist=luna&prompt=dreams'
          },
          paid: {
            endpoint: '/api/generate',
            headers: {
              'x402-proof': '<base64-encoded-payment-proof>'
            }
          }
        }
      });
    }

    // POST - Generate art (with optional payment)
    case 'POST': {
      const { action, artist, prompt, style, tier = 'basic' } = body;

      // Check payment
      const paymentResult = await checkPayment(req, tier);
      
      if (!paymentResult.authorized) {
        return res.status(402).json(paymentResult.response);
      }

      // Handle different actions
      switch (action) {
        case 'generate':
          return res.status(200).json({
            success: true,
            message: 'Art generation requires x402 payment',
            payment_required: {
              protocol: 'x402',
              tier,
              price: getPricing()[tier].price,
              recipient: '94DqLR6QLxwpw4uprxaDkfcFNgq1forzVK7jGuezsh2Z',
              asset: 'usdc',
              instructions: 'Include x402-proof header with payment'
            }
          });

        case 'status':
          return res.status(200).json({
            success: true,
            tier,
            features: getPricing()[tier].features
          });

        default:
          return res.status(400).json({
            error: 'Unknown action',
            available_actions: ['generate', 'status']
          });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// x402 Payment Flow Documentation
/*
1. Client requests resource:
   GET /api/x402
   
2. Server returns 402 with payment info:
   {
     "status": 402,
     "payment": {
       "protocol": "x402",
       "recipient": "94DqLR6QLxwpw4uprxaDkfcFNgq1forzVK7jGuezsh2Z",
       "asset": "usdc",
       "amount": "0.001"
     }
   }
   
3. Client pays and includes proof:
   POST /api/x402
   x402-proof: <base64-encoded-proof>
   
4. Server verifies and serves content:
   200 OK + art content
*/
