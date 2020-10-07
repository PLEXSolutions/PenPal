import { types, resolvers, loaders } from "./graphql/";
import _ from "lodash";
import PenPal from "meteor/penpal";

import { name as PLUGIN_NAME } from "./manifest.json";
import startN8nServer from "./n8n/n8n.js";
import WebhookManager from "./n8n/webhook.js";
import { WebhooksCollectionName } from "./constants.js";

const settings = {
  datastores: [
    {
      name: WebhooksCollectionName
    }
  ]
};

const N8nPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  },

  startupHook() {
    // Load stored webhooks
    const stored_webhooks = PenPal.DataStore.fetch(
      PLUGIN_NAME,
      WebhooksCollectionName,
      {}
    );

    _.each(stored_webhooks, webhook =>
      WebhookManager.registerWebhook(webhook, true)
    );

    // And then start the N8n server
    startN8nServer();
  }
};

export default N8nPlugin;
