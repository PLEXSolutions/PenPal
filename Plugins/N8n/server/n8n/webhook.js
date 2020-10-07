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
  registerWebhook(
    { _id = null, type, trigger, name, url },
    skip_insert = false
  ) {
    console.log(`[.] Registering ${type} webhook: ${url}`);

    let webhook_id = _id;
    if (!skip_insert) {
      webhook_id = PenPal.DataStore.insert(
        PLUGIN_NAME,
        WebhooksCollectionName,
        {
          type,
          trigger,
          name,
          url
        }
      );
    }

    if (!/webhook-test/.test(url)) {
      // If it's a test webhook, don't register with CoreAPI
      // Register the webhook so that it's actually going to get events
      PenPal.API.registerHook(
        type,
        trigger,
        webhook_id,
        webhookGenerator(url, type)
      );
    } else {
      console.log(
        "[.] N8n webhook identified as test webhook. Executing with mock data in 3 seconds..."
      );
      setTimeout(() => {
        console.log("[.] Executing test webhook mock data");
        executeTestWebhook(type, url);
      }, 3000);
    }

    return webhook_id;
  },

  getWebhook(id) {
    const stored_webhook = PenPal.DataStore.fetch(
      PLUGIN_NAME,
      WebhooksCollectionName,
      { _id: id }
    );

    if (stored_webhook.length > 0) {
      return stored_webhook[0];
    }

    return null;
  },

  deleteWebhook(id) {
    const stored_webhook = PenPal.DataStore.fetch(
      PLUGIN_NAME,
      WebhooksCollectionName,
      { _id: id }
    )?.[0];
    PenPal.DataStore.delete(PLUGIN_NAME, WebhooksCollectionName, { _id: id });

    if (!/webhook-test/.test(stored_webhook?.url ?? "")) {
      console.log("Deleting webhook from API");
      PenPal.API.deleteHook(id);
    }

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
