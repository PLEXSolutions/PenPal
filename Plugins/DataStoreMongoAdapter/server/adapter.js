import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import { Random } from "meteor/random";
import { check, Match } from "meteor/check";

const MongoAdapter = {};
MongoAdapter.MongoCollections = {};

// -----------------------------------------------------------------------
// MongoAdapter convenience functions

const collection_name = (plugin_name, store_name) =>
  `${plugin_name}.${store_name}`;

const get_collection = (plugin_name, store_name) =>
  MongoAdapter.MongoCollections[collection_name(plugin_name, store_name)];

const normalize_data = ({ id = null, ...rest } = {}) => {
  return { ...(id !== null && { _id: id }), ...rest };
};

const normalize_result = ({ _id = null, ...rest } = {}) => {
  return { ...(_id !== null && { id: String(_id) }), ...rest };
};

const check_options = options => {
  const { first, after, last, before } = options;
  check(first, Match.Maybe(Number));
  check(after, Match.Maybe(String));
  check(last, Match.Maybe(Number));
  check(before, Match.Maybe(String));
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

MongoAdapter.fetch = async (
  plugin_name,
  store_name,
  selector,
  options = {}
) => {
  check_options(options);
  const { first, after, last, before } = options;

  let cursor = get_collection(plugin_name, store_name).rawCollection();

  if (first !== undefined) {
    let _selector = normalize_data(selector);
    if (after !== undefined) {
      _selector = { $and: [{ _id: { $gt: after } }, _selector] };
    }
    cursor = cursor.find(_selector).limit(first);
  } else if (last !== undefined) {
    let _selector = normalize_data(selector);
    if (before !== undefined) {
      _selector = { $and: [{ _id: { $lt: before } }, _selector] };
    }
    cursor = cursor
      .find(_selector)
      .sort({ _id: -1 })
      .limit(last);
  } else {
    cursor = cursor.find(normalize_data(selector));
  }

  const data = await cursor.toArray();

  return data.map(doc => normalize_result(doc));
};

MongoAdapter.fetchOne = async (plugin_name, store_name, selector, options) => {
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
  return get_collection(plugin_name, store_name).remove(
    normalize_data(selector)
  );
};

// -----------------------------------------------------------------------

export default MongoAdapter;
