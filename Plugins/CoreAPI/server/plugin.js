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
  registerHook as apiRegisterHook,
  deleteHook as apiDeleteHook,
} from "./api-functions";
import { dockerExec, dockerBuild, dockerRun } from "./api/docker";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { mocks } from "./test/";

const settings = {
  configuration: {
    schema_root: "CoreAPIConfiguration",
    getter: "getCoreAPIConfiguration",
    setter: "setCoreAPIConfiguration",
  },
  datastores: [
    {
      name: "Projects",
    },
    {
      name: "Hosts",
    },
    {
      name: "Services",
    },
    {
      name: "Netblocks",
    },
    {
      name: "Configuration",
    },
  ],
};

const CoreAPIPlugin = {
  loadPlugin() {
    // Register API Hooks
    PenPal.API.Hosts = {
      Upsert: (args) => {
        return upsertHosts(args);
      },
      Remove: (args) => {
        return removeHosts(args);
      },
      Get: (args) => {
        return getHosts(args);
      },
    };

    PenPal.API.Projects = {
      Upsert: (args) => {
        return upsertProjects(args);
      },
      Remove: (args) => {
        return removeProjects(args);
      },
      Get: (args) => {
        return getProjects(args);
      },
    };

    PenPal.API.Services = {
      Upsert: (args) => {
        return upsertServices(args);
      },
      Remove: (args) => {
        return removeServices(args);
      },
      Get: (args) => {
        return getServices(args);
      },
    };

    PenPal.API.Docker = {
      Exec: async (args) => {
        return dockerExec(args);
      },
      Build: async (args) => {
        return dockerBuild(args);
      },
    };

    PenPal.API.AsyncNOOP = async () => {
      await delay(0);
    };

    PenPal.API.registerHook = apiRegisterHook;
    PenPal.API.deleteHook = apiDeleteHook;

    PenPal.Test.CoreAPI = { ...mocks };

    return {
      types,
      resolvers,
      loaders: {},
      settings,
    };
  },
};

export default CoreAPIPlugin;
