import PenPal from "meteor/penpal";
import DataStore from "./datastore.js";

const DataStorePlugin = {
  loadPlugin() {
    PenPal.DataStore = DataStore;

    return {
      types: {},
      resolvers: {},
      loaders: {},
      settings: {}
    };
  }
};

export default DataStorePlugin;
