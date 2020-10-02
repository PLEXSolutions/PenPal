import { types, resolvers, loaders } from "./graphql";

const settings = {
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
