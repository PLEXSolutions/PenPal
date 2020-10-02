//import { types, resolvers, loaders } from "./graphql";
import startN8nServer from "./n8n/n8n.js";

const settings = {};

const N8nPlugin = {
  loadPlugin() {
    return {
      types: {},
      resolvers: {},
      loaders: {},
      settings
    };
  },

  startupHook() {
    startN8nServer();
  }
};

export default N8nPlugin;
