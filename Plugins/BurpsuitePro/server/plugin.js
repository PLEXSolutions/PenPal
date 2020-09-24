import { types, resolvers, loaders } from "./graphql";

const settings = {
  configuration: {
    schema_root: 'BurpsuiteProConfiguration',
    getter: 'getBurpsuiteProConfiguration',
    setter: 'setBurpsuiteProConfiguration'
  },
  datastores: [
    {
      name: 'settings'
    }
  ]
};

const BurpsuiteProPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default BurpsuiteProPlugin;
