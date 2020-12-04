import _ from "lodash";
import PenPal from "meteor/penpal";
import DataLoader from "dataloader";

import { types, resolvers, loaders } from "./graphql";
import * as API from "./api/";
import { dockerExec, dockerBuild, dockerRun } from "./api/docker";
import { mocks } from "./test/";

const settings = {
  configuration: {
    schema_root: "CoreAPIConfiguration",
    getter: "getCoreAPIConfiguration",
    setter: "setCoreAPIConfiguration"
  },
  dashboard: {
    schema_root: "CoreAPIAnalytics",
    getter: "getCoreAPIAnalytics"
  },
  datastores: [
    {
      name: "Customers"
    },
    {
      name: "Projects"
    },
    {
      name: "Hosts"
    },
    {
      name: "Networks"
    },
    {
      name: "Services"
    },
    {
      name: "Configuration"
    }
  ]
};

const CoreAPIPlugin = {
  loadPlugin() {
    // Register API Hooks
    PenPal.API.Customers = {
      Get: API.getCustomer,
      GetMany: API.getCustomers,
      Insert: API.insertCustomer,
      InsertMany: API.insertCustomers,
      Remove: API.removeCustomer,
      RemoveMany: API.removeCustomers,
      Update: API.updateCustomer,
      UpdateMany: API.updateCustomers,
      UpsertMany: API.upsertCustomers
    };

    PenPal.API.Projects = {
      Get: API.getProject,
      GetMany: API.getProjects,
      Insert: API.insertProject,
      InsertMany: API.insertProjects,
      Remove: API.removeProject,
      RemoveMany: API.removeProjects,
      Update: API.updateProject,
      UpdateMany: API.updateProjects,
      UpsertMany: API.upsertProjects
    };

    PenPal.API.Hosts = {
      Get: API.getHost,
      GetMany: API.getHosts,
      GetManyByProjectID: API.getHostsByProject,
      GetManyByNetworkID: API.getHostsByNetwork,
      Insert: API.insertHost,
      InsertMany: API.insertHosts,
      Remove: API.removeHost,
      RemoveMany: API.removeHosts,
      Update: API.updateHost,
      UpdateMany: API.updateHosts,
      UpsertMany: API.upsertHosts
    };

    PenPal.API.Networks = {
      Get: API.getNetwork,
      GetMany: API.getNetworks,
      GetManyByProjectID: API.getNetworksByProject,
      Insert: API.insertNetwork,
      InsertMany: API.insertNetworks,
      Remove: API.removeNetwork,
      RemoveMany: API.removeNetworks,
      Update: API.updateNetwork,
      UpdateMany: API.updateNetworks
    };

    PenPal.API.Services = {
      Upsert: API.upsertServices,
      Remove: API.removeServices,
      Get: API.getServices
    };

    // This builds a unique set of wrapped functions that can pass a cache object as the final
    // argument to each API function. The API function has the ability to interact with the
    // .get or .add of that cache as they see fit. A nop_cache implementation that does nothing
    // should be the default final argument of each API function that desires to use the cache
    // so that there needs not be any logic around whether or not a cache actually exists - the
    // code just pretends one always exists
    PenPal.API.CachingAPI = () => {
      const caching_apis = {};

      for (let api_key of Object.keys(PenPal.API)) {
        // The "batch" getter is the GetMany function
        const batch_api_getter = PenPal.API[api_key].GetMany;
        if (batch_api_getter === undefined) {
          continue;
        }

        // Build the dataloader
        const api_dataloader = new DataLoader(keys => batch_api_getter(keys));

        const { Get, GetMany, ...OtherFunctions } = PenPal.API[api_key];

        // Build the object that's going to hold all the caching functions
        caching_apis[api_key] = {
          async Get(key) {
            return await api_dataloader.load(key);
          },
          async GetMany(keys, options) {
            if (keys === undefined) {
              // There's no way to use a cache when all records are requested, so get all the records and
              // cache them for any future requests
              const results = await PenPal.API[api_key].GetMany();
              for (let result of results) {
                api_dataloader.clear(result.id).prime(result.id, result);
              }
              return results;
            } else if (options !== undefined) {
              // There's no simple way to use the cache when doing pagination, so use the underlying DataStore
              // functionality to do so when options are passed in
              const results = await PenPal.API[api_key].GetMany(keys, options);
              for (let result of results) {
                api_dataloader.clear(result.id).prime(result.id, result);
              }
              return results;
            } else {
              return await api_dataloader.loadMany(keys);
            }
          },
          // TODO: At some point consider using the "prime" functions of the data loader to cache the results
          // of and insert, update, etc
          ...OtherFunctions
        };
      }

      return caching_apis;
    };

    PenPal.API.Docker = {
      Exec: API.dockerExec,
      Build: API.dockerBuild
    };

    PenPal.API.AsyncNOOP = API.AsyncNOOP;

    PenPal.API.registerHook = API.registerHook;
    PenPal.API.deleteHook = API.deleteHook;

    PenPal.Test.CoreAPI = { ...mocks };

    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default CoreAPIPlugin;
