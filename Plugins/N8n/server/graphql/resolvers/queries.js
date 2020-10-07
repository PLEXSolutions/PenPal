import WebhookManager from "../../n8n/webhook.js";

export default {
  async checkN8nWebhook(root, { id }, context) {
    console.log(`[.] Checking for n8n webhook ${id}`);

    return WebhookManager.getWebhook(id);
  }
};
