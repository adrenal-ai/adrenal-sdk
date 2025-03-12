# Adrenal SDK

Official SDKs for Adrenal AI chatbots.

## Available SDKs

### JavaScript/Node.js (`@adrenal-sdk`)

```bash
npm install @adrenal-sdk
```

#### React Components

```jsx
import { ChatbotWidget, useChatbot } from '@adrenal-sdk/react';

// Using the widget
function App() {
  return (
    <div>
      <h1>My App</h1>
      <ChatbotWidget publishId="your-publish-id" />
    </div>
  );
}

// Using the hook for custom UI
function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages
  } = useChatbot({
    publishId: 'your-publish-id'
  });

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
        {isLoading && (
          <button onClick={stop}>Stop</button>
        )}
      </form>
    </div>
  );
}
```

#### Server Utilities

```javascript
const { AdrenalClient } = require('@adrenal-sdk/server');

// Initialize the client
const client = new AdrenalClient('your-api-key');

// Verify webhooks
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-signature'];
  
  // Using environment variable ADRENAL_WEBHOOK_SECRET
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

### Python (`adrenal-sdk`)

```bash
pip install adrenal-sdk
```

#### Server Utilities

```python
from adrenal_sdk import AdrenalClient

# Initialize the client
client = AdrenalClient("your-api-key")

# Verify webhooks (using Flask as an example)
@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('x-signature')
    
    # Using environment variable ADRENAL_WEBHOOK_SECRET
    is_valid = client.verify_webhook(request.json, signature)
    # OR passing secret directly
    is_valid = client.verify_webhook(request.json, signature, "your-webhook-secret")

    if not is_valid:
        return {"error": "Invalid signature"}, 401

    # Process webhook...
    event_type = request.json.get("event_type")
    print(f"Received webhook: {event_type}")
    return "", 200
```

## Repository Structure

```
adrenal-sdk/
├── javascript/           # JavaScript/Node.js SDK
│   └── packages/
│       ├── react/       # React components
│       └── server/      # Node.js utilities
└── python/              # Python SDK
```
