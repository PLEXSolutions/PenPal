import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

const DataStore = {};
DataStore._Adapters = []; // Meant to be internal, so don't make it obviously accessible. Maybe make this a real class at some point?

// -----------------------------------------------------------------------
// DataStore meta functions

DataStore.RegisterAdapter = (AdapterName, Adapter) =>
  DataStore._Adapters.push({ AdapterName, Adapter });

DataStore.GetAdapter = AdapterName =>
  _.find(DataStore._Adapters, adapter => adapter.AdapterName === AdapterName)
    ?.Adapter ?? null;

// -----------------------------------------------------------------------
// DataStore creation/deletion functions

DataStore.CreateStore = async (plugin_name, store_name) => {
  return await Promise.all(
    DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
      AdapterName,
      result: (await Adapter.CreateStore?.(plugin_name, store_name)) ?? null
    }))
  );
};

DataStore.CreateStores = async (plugin_name, stores = []) => {
  return await Promise.all(
    stores.map(
      async store_name => await DataStore.CreateStore(plugin_name, store_name)
    )
  );
};

DataStore.DeleteStore = async (plugin_name, store_name) => {
  return await Promise.all(
    DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
      AdapterName,
      result: (await Adapter.DeleteStore?.(plugin_name, store_name)) ?? null
    }))
  );
};

// -----------------------------------------------------------------------
// DataStore operations
// TODO: Figure out how to abstract multiple results from multiple datastores

DataStore.fetch = async (plugin_name, store_name, selector) => {
  return (
    await Promise.all(
      DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
        AdapterName,
        result: Adapter.fetch?.(plugin_name, store_name, selector) ?? null
      }))
    )
  )[0].result;
};

DataStore.fetchOne = async (plugin_name, store_name, selector) => {
  return (
    await Promise.all(
      DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
        AdapterName,
        result:
          (await Adapter.fetchOne?.(plugin_name, store_name, selector)) ?? null
      }))
    )
  )[0].result;
};

// On insert, we generate an ID for the different adapters to ensure consistency across the board
DataStore.insert = async (plugin_name, store_name, data) => {
  return (
    await Promise.all(
      DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
        AdapterName,
        result:
          (await Adapter.insert?.(plugin_name, store_name, {
            id: uuidv4(),
            ...data
          })) ?? null
      }))
    )
  )[0].result;
};

// On insert, we generate an ID for the different adapters to ensure consistency across the board
DataStore.insertMany = async (plugin_name, store_name, data) => {
  return (
    await Promise.all(
      DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
        AdapterName,
        result:
          (await Adapter.insertMany?.(
            plugin_name,
            store_name,
            data.map(datum => ({ id: uuidv4(), ...datum }))
          )) ?? null
      }))
    )
  )[0].result;
};

DataStore.update = async (plugin_name, store_name, selector, data) => {
  return (
    await Promise.all(
      DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
        AdapterName,
        result:
          (await Adapter.update?.(plugin_name, store_name, selector, data)) ??
          null
      }))
    )
  )[0].result;
};

DataStore.delete = async (plugin_name, store_name, selector) => {
  return (
    await Promise.all(
      DataStore._Adapters.map(async ({ AdapterName, Adapter }) => ({
        AdapterName,
        result:
          (await Adapter.delete?.(plugin_name, store_name, selector)) ?? null
      }))
    )
  )[0].result;
};

// -----------------------------------------------------------------------

export default DataStore;
