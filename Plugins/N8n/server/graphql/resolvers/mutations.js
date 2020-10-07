import WebhookManager from "../../n8n/webhook.js";

export default {
  async createN8nWebhook(root, { id, url, type, trigger }, context) {
    console.log("[.] Creating webhook", id, url, trigger, type);

    WebhookManager.registerWebhook({ type, trigger, name: id, url });

    return {
      id,
      url,
      type,
      trigger
    };
  },

  async deleteN8nWebhook(root, { id }, context) {
    console.log("[.] Deleting webhook", id);
    return WebhookManager.deleteWebhook(id);
  }
};
