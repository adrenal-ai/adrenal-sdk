import os
import hmac
import json
import hashlib
from typing import Dict, Optional

class AdrenalClient:
    def __init__(self, api_key: str):
        """Initialize the Adrenal client.

        Args:
            api_key (str): Your Adrenal API key
        """
        self.api_key = api_key

    def verify_webhook(
        self, 
        body: Dict, 
        signature: str, 
        secret_key: Optional[str] = None
    ) -> bool:
        """Verify a webhook signature.

        Args:
            body (Dict): The webhook request body
            signature (str): The X-Signature header value
            secret_key (Optional[str], optional): The webhook secret key. 
                Defaults to os.environ.get('ADRENAL_WEBHOOK_SECRET').

        Returns:
            bool: True if signature is valid, False otherwise

        Raises:
            ValueError: If no secret key is provided or found in environment
        """
        secret_key = secret_key or os.environ.get('ADRENAL_WEBHOOK_SECRET')
        if not secret_key:
            raise ValueError(
                'Webhook secret key is required. Set ADRENAL_WEBHOOK_SECRET environment variable or pass it as an argument.'
            )

        computed = hmac.new(
            secret_key.encode(),
            json.dumps(body).encode(),
            hashlib.sha256
        ).hexdigest()

        try:
            return hmac.compare_digest(computed.encode(), signature.encode())
        except:
            return False 