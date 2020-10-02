import { types, resolvers, loaders } from "./graphql";
const settings = {};

const MasscanPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings,
    };
  },
};

export default MasscanPlugin;
