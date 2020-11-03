import PenPal from "meteor/penpal";
import MongoAdapter from "./adapter.js";
import { types, resolvers, loaders } from "./graphql";

const settings = {
  configuration: {
    schema_root: "MongoDataStoreConfiguration",
    getter: "getMongoDataStoreConfiguration",
    setter: "setMongoDataStoreConfiguration"
  },
  datastores: [
    {
      name: "Configuration"
    }
  ]
};

const MongoDataStorePlugin = {
  loadPlugin() {
    PenPal.DataStore.RegisterAdapter("MongoAdapter", MongoAdapter);

    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default MongoDataStorePlugin;
