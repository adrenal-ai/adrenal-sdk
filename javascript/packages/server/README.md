# @adrenal-sdk/server

Node.js server utilities for Adrenal AI chatbots.

## Installation

```bash
npm install @adrenal-sdk/server
```

## Usage

### Initialize the Client

```javascript
const { AdrenalClient } = require('@adrenal-sdk/server');

const client = new AdrenalClient('your-api-key');
```

### Verify Webhooks

Verify incoming webhooks from Adrenal AI. You can either:
1. Set the `ADRENAL_WEBHOOK_SECRET` environment variable
2. Pass the secret key directly to the method

```javascript
// Using Express.js as an example
app.post('/webhook', (req, res) => {
  const client = new AdrenalClient('your-api-key');
  const signature = req.headers['x-signature'];
  
  // Using environment variable
  const isValid = client.verifyWebhook(req.body, signature);
  // OR passing secret directly
  const isValid = client.verifyWebhook(req.body, signature, 'your-webhook-secret');

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook...
  const { event_type, messages, chatbot } = req.body;
  console.log('Received webhook:', event_type);
});
```

## API Reference

### `new AdrenalClient(apiKey)`
Creates a new Adrenal client instance.

- `apiKey` (string): Your Adrenal API key

### `verifyWebhook(body, signature, secretKey?)`
Verifies a webhook signature.

- `body` (object): The webhook request body
- `signature` (string): The X-Signature header value
- `secretKey` (string, optional): The webhook secret key. Defaults to `process.env.ADRENAL_WEBHOOK_SECRET`

Returns `boolean`: `true` if signature is valid, `false` otherwise. 