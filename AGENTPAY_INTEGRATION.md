# AgentPay Integration for RESONANCE

## Overview

This integration allows RESONANCE to accept payments via AgentPay for AI-generated art.

## Setup

### 1. Wait for Endpoint
The AgentPay endpoint is provided by antigravity. Once available:
```
Endpoint: https://<agentpay-url>
```

### 2. Configure
Edit `src/pages/api/agentpay.ts`:
```typescript
private endpoint: string = 'https://<agentpay-url>';
private wallet: string = '94DqLR6QLxwpw4uprxaDkfcFNgq1forzVK7jGuezsh2Z';
```

### 3. Register Service
```bash
curl -X POST https://resonance-production.up.railway.app/api/agentpay \
  -H "Content-Type: application/json" \
  -d '{"action": "register"}'
```

## Usage

### Create Payment Stream
```bash
curl -X POST https://resonance-production.up.railway.app/api/agentpay \
  -H "Content-Type: application/json" \
  -d '{"action": "create_payment", "userId": "user123", "artType": "visual"}'
```

### Generate Art (after payment)
```bash
curl "https://resonance-production.up.railway.app/api/agentpay?streamId=<stream_id>&action=generate&artPrompt=purple%20dreams"
```

## Integration Flow

```
User → RESONANCE API → AgentPay (create stream) → User pays → AgentPay verifies → Art delivered
```

## AgentPay Bounty

**First 5 integrations:** 0.01 SOL each!

## Wallet

**RESONANCE AgentPay Wallet:**
```
94DqLR6QLxwpw4uprxaDkfcFNgq1forzVK7jGuezsh2Z
```

## Status

- [x] Integration code written
- [ ] AgentPay endpoint available
- [ ] Register service
- [ ] Test payment flow
- [ ] Complete bounty (0.01 SOL)
