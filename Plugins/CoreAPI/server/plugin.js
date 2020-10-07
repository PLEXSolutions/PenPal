import { types, resolvers, loaders } from "./graphql";
import _ from "lodash";
import PenPal from "meteor/penpal";
import {
  getHosts,
  getProjects,
  getServices,
  removeHosts,
  removeProjects,
  removeServices,
  upsertHosts,
  upsertProjects,
  upsertServices,
  registerHook as apiRegisterHook
} from "./api-functions";

import { mocks } from "./test/";

const settings = {
  configuration: {
    schema_root: "CoreAPIConfiguration",
    getter: "getCoreAPIConfiguration",
    setter: "setCoreAPIConfiguration"
  },
  datastores: [
    {
      name: "Projects"
    },
    {
      name: "Hosts"
    },
    {
      name: "Services"
    },
    {
      name: "Netblocks"
    },
    {
      name: "Configuration"
    }
  ]
};

const CoreAPIPlugin = {
  loadPlugin() {
    // Register API Hooks
    PenPal.API.Hosts = {
      Upsert: args => {
        return upsertHosts(args);
      },
      Remove: args => {
        return removeHosts(args);
      },
      Get: args => {
        return getHosts(args);
      }
    };

    PenPal.API.Projects = {
      Upsert: args => {
        return upsertProjects(args);
      },
      Remove: args => {
        return removeProjects(args);
      },
      Get: args => {
        return getProjects(args);
      }
    };

    PenPal.API.Services = {
      Upsert: args => {
        return upsertServices(args);
      },
      Remove: args => {
        return removeServices(args);
      },
      Get: args => {
        return getServices(args);
      }
    };

    PenPal.API.registerHook = apiRegisterHook;

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
