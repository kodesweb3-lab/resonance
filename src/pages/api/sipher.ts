import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  generateStealthAddress, 
  createPrivatePayment, 
  getPrivacyStatus,
  createPrivacyConfig,
  PRIVACY_TIERS 
} from '@/lib/sipher';

// Sipher Privacy API for RESONANCE
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;

  switch (method) {
    // GET - Check privacy status
    case 'GET': {
      return res.status(200).json({
        service: 'RESONANCE Sipher Integration',
        protocol: 'Sipher',
        version: '1.0',
        ...createPrivacyConfig()
      });
    }

    // POST - Create private payment
    case 'POST': {
      const { action, userId, recipient, amount, memo, privacy } = body;

      switch (action) {
        case 'generate_address': {
          // Generate stealth address for user
          const stealth = generateStealthAddress(userId || Date.now().toString());
          
          return res.status(200).json({
            success: true,
            stealthAddress: stealth.address,
            viewingKey: stealth.viewingKey,
            message: 'Use this viewingKey to decrypt incoming payments'
          });
        }

        case 'send_private': {
          // Send private payment
          const result = await createPrivatePayment(
            recipient,
            amount,
            memo,
            privacy || 'stealth'
          );
          
          return res.status(result.success ? 200 : 400).json(result);
        }

        case 'status': {
          // Check if Sipher is configured
          return res.status(200).json(createPrivacyConfig());
        }

        default:
          return res.status(400).json({
            error: 'Unknown action',
            available_actions: [
              'generate_address',
              'send_private',
              'status'
            ]
          });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Sipher Privacy Flow Documentation
/*
1. Generate stealth address for user:
   POST /api/sipher { action: 'generate_address', userId: 'user123' }
   → Returns: { stealthAddress, viewingKey }

2. Send private payment:
   POST /api/sipher { 
     action: 'send_private',
     recipient: '0x...',
     amount: 0.01,
     privacy: 'stealth'
   }
   → Returns: { success, transaction, stealthAddress }

3. Check status:
   GET /api/sipher
   → Returns: { configured, features, tiers }
*/
