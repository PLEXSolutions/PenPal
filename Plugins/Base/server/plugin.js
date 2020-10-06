import { types, resolvers, loaders } from "./graphql";
import PenPal from "meteor/penpal";

const settings = {};

const BasePlugin = {
  loadPlugin() {
    PenPal.Test = {};

    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default BasePlugin;
