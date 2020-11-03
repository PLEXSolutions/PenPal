import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import { Random } from "meteor/random";

const MongoAdapter = {};
MongoAdapter.MongoCollections = {};

// -----------------------------------------------------------------------
// MongoAdapter convenience functions

const collection_name = (plugin_name, store_name) =>
  `${plugin_name}.${store_name}`;

const get_collection = (plugin_name, store_name) =>
  MongoAdapter.MongoCollections[collection_name(plugin_name, store_name)];

const normalize_data = ({ id = null, ...rest }) => {
  return { ...(id !== null && { _id: id }), ...rest };
};

const normalize_result = ({ _id = null, ...rest }) => {
  return { ...(_id !== null && { id: String(_id) }), ...rest };
};

// -----------------------------------------------------------------------
// MongoAdapter creation/deletion functions

MongoAdapter.CreateStore = async (plugin_name, store_name) => {
  return (MongoAdapter.MongoCollections[
    collection_name(plugin_name, store_name)
  ] = new Mongo.Collection(collection_name(plugin_name, store_name)));
};

MongoAdapter.DeleteStore = async (plugin_name, store_name) => {
  return await get_collection(plugin_name, store_name)
    .rawCollection()
    .drop();
};

// -----------------------------------------------------------------------
// MongoAdapter operations

MongoAdapter.fetch = async (plugin_name, store_name, selector) => {
  return get_collection(plugin_name, store_name)
    .find(normalize_data(selector))
    .fetch()
    .map(doc => normalize_result(doc));
};

MongoAdapter.fetchOne = async (plugin_name, store_name, selector) => {
  return normalize_result(
    get_collection(plugin_name, store_name).findOne(normalize_data(selector))
  );
};

MongoAdapter.insert = async (plugin_name, store_name, data) => {
  // This will return an ObjectId, so cast it to a string
  return String(
    get_collection(plugin_name, store_name).insert(normalize_data(data))
  );
};

MongoAdapter.insertMany = async (plugin_name, store_name, data = []) => {
  // We don't use normalize_result on this because it returns an array of ObjectIds instead of an array of objects
  const results = await get_collection(plugin_name, store_name)
    .rawCollection()
    .insertMany(data.map(datum => normalize_data(datum)));

  return (
    Object.values(results.insertedIds)?.map(object_id => ({
      id: String(object_id)
    })) ?? []
  );
};

MongoAdapter.update = async (plugin_name, store_name, selector, data) => {
  return normalize_result(
    get_collection(plugin_name, store_name).update(
      normalize_data(selector),
      data
    )
  );
};

MongoAdapter.delete = async (plugin_name, store_name, selector) => {
  return;
  get_collection(plugin_name, store_name).remove(normalize_data(selector));
};

// -----------------------------------------------------------------------

export default MongoAdapter;
