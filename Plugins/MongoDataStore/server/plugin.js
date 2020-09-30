import { types, resolvers, loaders } from "./graphql";
import PenPal from "meteor/penpal";

const settings = {
  configuration: {
    schema_root: 'MongoDataStoreConfiguration',
    getter: 'getMongoDataStoreConfiguration',
    setter: 'setMongoDataStoreConfiguration'
  },
  datastores: [
    {
      name:"Configuration"
    }
  ]
};

const MongoDataStorePlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default MongoDataStorePlugin;
