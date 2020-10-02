import { types, resolvers, loaders } from "./graphql";

const settings = {
  n8n: {
    workflow_nodes: [
      {
        displayName: "Update Host",
        name: "BaseUpdateHost",
        icon: "fa:question-circle",
        description: "Send information to the PenPal server for the given host",
        properties: [
          {
            displayName: "Host",
            name: "host",
            type: "string",
            default: "",
            description: "The host ID that the new data belongs to",
            required: true
          }
        ]
      }
    ],
    trigger_nodes: [
      {
        displayName: "New Host",
        name: "BaseNewHost",
        icon: "fa:network-wired",
        description:
          "Webhook that will get called when a new host is added to PenPal",
        properties: [],
        trigger_name: "BaseNewHost"
      }
    ]
  }
};

const BasePlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default BasePlugin;
