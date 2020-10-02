import { executeWebhook } from "../../n8n.js";

export default {
  async createN8nWebhook(root, { id, url }, context) {
    console.log("[.] Creating webhook", id, url);

    setTimeout(async () => {
      console.log("[.] Testing webhook");
      const webhook_test = await executeWebhook(url, { test: "test" });
      console.log(`[.] ${JSON.stringify(webhook_test)}`);
    }, 3000);

    return {
      id,
      url
    };
  },

  async deleteN8nWebhook(root, { id }, context) {
    console.log("Deleting webhook", id);
    return true;
  }
};
