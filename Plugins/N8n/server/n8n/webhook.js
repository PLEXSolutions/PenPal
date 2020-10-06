import PenPal from "meteor/penpal";
import { name as PLUGIN_NAME } from "../manifest.json";
import { WebhooksCollectionName } from "../constants.js";
import fetch from "node-fetch";

const webhookGenerator = (url, arg_field_name) => {
  return async data => {
    WebhookManager.executeWebhook(url, { [arg_field_name]: data });
  };
};

const executeTestWebhook = (type, url) => {
  let mockDataFunc = () => null;

  switch (type) {
    case "project":
      //mockDataFunc = PenPal.Test.CoreAPI.mockHost;
      break;
    case "host":
      mockDataFunc = PenPal.Test.CoreAPI.mockHosts;
      break;
    case "service":
      //mockDataFunc = PenPal.Test.CoreAPI.mockHost;
      break;
  }

  WebhookManager.executeWebhook(url, {
    [type]: mockDataFunc().map(datum => datum.id)
  });
};

const WebhookManager = {
  registerWebhook({ type, trigger, name, url }, skip_insert = false) {
    console.log(`[.] Registering ${type} webhook: ${url}`);

    if (!/webhook-test/.test(url)) {
      // If it's a test webhook, don't register with CoreAPI
      // Register the webhook so that it's actually going to get events
      PenPal.API.registerHook(type, trigger, name, webhookGenerator(url, type));
    } else {
      console.log(
        "[.] N8n webhook identified as test webhook. Executing with mock data in 3 seconds..."
      );
      setTimeout(() => {
        console.log("[.] Executing test webhook mock data");
        executeTestWebhook(type, url);
      }, 3000);
    }

    if (!skip_insert) {
      PenPal.DataStore.insert(PLUGIN_NAME, WebhooksCollectionName, {
        type,
        trigger,
        name,
        url
      });
    }
  },

  getWebhook(name) {
    const stored_webhook = PenPal.DataStore.fetch(
      PLUGIN_NAME,
      WebhooksCollectionName,
      { name }
    );

    if (stored_webhook.length > 0) {
      return stored_webhook[0];
    }

    return null;
  },

  deleteWebhook(name) {
    PenPal.DataStore.delete(PLUGIN_NAME, WebhooksCollectionName, { name });
    return true;
  },

  async executeWebhook(url, args = {}) {
    console.log(`[.] Executing webhook: ${url}`);
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" }
    });
    return await result.json();
  }
};

export default WebhookManager;
