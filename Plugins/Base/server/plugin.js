import { types, resolvers, loaders } from "./graphql";

const settings = {
  n8n: {
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
