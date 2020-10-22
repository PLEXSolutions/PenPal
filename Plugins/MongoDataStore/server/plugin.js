import { types, resolvers, loaders } from "./graphql";
import _ from "lodash";
import { Mongo } from "meteor/mongo";
import PenPal from "meteor/penpal";

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
    PenPal.MongoCollections = {};
    PenPal.DataStore = {}; // TODO: need this to exist in a general DataStore plugin once we move past Mongo

    PenPal.DataStore.update = (plugin_name, table, selector, update) => {
      return PenPal.MongoCollections[`${plugin_name}${table}`].update(
        selector,
        update
      );
    };

    PenPal.DataStore.insert = (plugin_name, table, obj) => {
      return PenPal.MongoCollections[`${plugin_name}${table}`].insert(obj);
    };

    PenPal.DataStore.insertMany = (plugin_name, table, obj) => {
      return PenPal.MongoCollections[`${plugin_name}${table}`]
        .rawCollection()
        .insertMany(obj);
    };

    PenPal.DataStore.create = (plugin_name, table) => {
      return (PenPal.MongoCollections[
        `${plugin_name}${table}`
      ] = new Mongo.Collection(`${plugin_name}${table}`));
    };

    PenPal.DataStore.fetch = (plugin_name, table, selector) => {
      return PenPal.MongoCollections[`${plugin_name}${table}`]
        .find(selector)
        .fetch();
    };

    PenPal.DataStore.fetchOne = (plugin_name, table, selector) => {
      return PenPal.DataStore.fetch(plugin_name, table, selector)?.[0];
    };

    PenPal.DataStore.delete = (plugin_name, table, selector) => {
      return PenPal.MongoCollections[`${plugin_name}${table}`].remove(selector);
    };

    PenPal.DataStore.drop = (plugin_name, table) => {
      return PenPal.MongoCollections[`${plugin_name}${table}`]
        .rawCollection()
        .drop();
    };

    PenPal.DataStore.createStorage = (plugin_name, datastoresObject) => {
      _.each(datastoresObject, datastore => {
        PenPal.MongoCollections[
          `${plugin_name}${datastore.name}`
        ] = new Mongo.Collection(`${plugin_name}${datastore.name}`);
      });
    };

    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default MongoDataStorePlugin;
