// Overall PenPal coordinating server code
import PenPal from "meteor/penpal";
import _ from "lodash";
import { Mongo } from "meteor/mongo";

// Plugin-specific info
import Plugin from "./plugin.js";
import Manifest from "./manifest.json";

// Register the plugin
PenPal.registerPlugin(Manifest, Plugin);
PenPal.MongoCollections = {}

PenPal.DataStore.update = (plugin_name, table, selector, update) => {
    return PenPal.MongoCollections[`${plugin_name}${table}`].update(selector, update)
}

PenPal.DataStore.insert = (plugin_name, table, obj) => {
    return PenPal.MongoCollections[`${plugin_name}${table}`].insert(obj)
}

PenPal.DataStore.insertMany = (plugin_name, table, obj) => {
    return PenPal.MongoCollections[`${plugin_name}${table}`].rawCollection().insertMany(obj)
}

PenPal.DataStore.create = (plugin_name, table) => {
    return PenPal.MongoCollections[`${plugin_name}${table}`] = new Mongo.Collection(`${plugin_name}${table}`)
}

PenPal.DataStore.fetch = (plugin_name, table, selector) => {
    return PenPal.MongoCollections[`${plugin_name}${table}`].find(selector).fetch()
}

PenPal.DataStore.delete = (plugin_name, table, selector) => {
    console.log(selector)
    return PenPal.MongoCollections[`${plugin_name}${table}`].remove(selector)
}

PenPal.DataStore.drop = (plugin_name, table) => {
    return PenPal.MongoCollections[`${plugin_name}${table}`].rawCollection().drop()
}

PenPal.DataStore.createStorage = (plugin_name, datastoresObject) => {
    _.each(datastoresObject, (datastore) => {
        PenPal.MongoCollections[`${plugin_name}${datastore.name}`] = new Mongo.Collection(`${plugin_name}${datastore.name}`)
    }) 
 }