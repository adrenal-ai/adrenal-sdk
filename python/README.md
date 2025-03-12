# Adrenal Python SDK

Official Python SDK for Adrenal AI chatbots.

## Installation

```bash
pip install adrenal-sdk
```

## Usage

### Initialize the Client

```python
from adrenal_sdk import AdrenalClient

client = AdrenalClient("your-api-key")
```

### Verify Webhooks

Verify incoming webhooks from Adrenal AI. You can either:
1. Set the `ADRENAL_WEBHOOK_SECRET` environment variable
2. Pass the secret key directly to the method

```python
# Using Flask as an example
from flask import Flask, request

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('x-signature')
    
    # Using environment variable
    is_valid = client.verify_webhook(request.json, signature)
    # OR passing secret directly
    is_valid = client.verify_webhook(request.json, signature, "your-webhook-secret")

    if not is_valid:
        return {"error": "Invalid signature"}, 401

    # Process webhook...
    event_type = request.json.get("event_type")
    messages = request.json.get("messages")
    chatbot = request.json.get("chatbot")
    print(f"Received webhook: {event_type}")
    return "", 200
```

## API Reference

### `AdrenalClient`

#### `__init__(api_key: str)`
Creates a new Adrenal client instance.
- `api_key` (str): Your Adrenal API key

#### `verify_webhook(body: Dict, signature: str, secret_key: Optional[str] = None) -> bool`
Verifies a webhook signature.
- `body` (Dict): The webhook request body
- `signature` (str): The X-Signature header value
- `secret_key` (Optional[str]): The webhook secret key. Defaults to `os.environ.get('ADRENAL_WEBHOOK_SECRET')`
- Returns: `bool`
- Raises: `ValueError` if no secret key is provided or found in environment 