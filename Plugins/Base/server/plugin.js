import { types, resolvers, loaders } from "./graphql";

console.log(resolvers);

const settings = {};

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
