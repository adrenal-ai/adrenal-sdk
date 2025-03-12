const crypto = require('crypto');

class AdrenalClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  verifyWebhook(body, signature, secretKey = process.env.ADRENAL_WEBHOOK_SECRET) {
    if (!secretKey) {
      throw new Error('Webhook secret key is required. Set ADRENAL_WEBHOOK_SECRET environment variable or pass it as an argument.');
    }

    const hmac = crypto.createHmac('sha256', secretKey);
    const computed = hmac.update(JSON.stringify(body)).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
    } catch {
      return false;
    }
  }
}

module.exports = { AdrenalClient }; 