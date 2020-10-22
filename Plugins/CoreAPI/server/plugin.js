import { types, resolvers, loaders } from "./graphql";
import _ from "lodash";
import PenPal from "meteor/penpal";
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
    PenPal.API.Customers = {
      Upsert: API.upsertCustomers,
      Remove: API.removeCustomers,
      Get: API.getCustomers
    };

    PenPal.API.Hosts = {
      Upsert: API.upsertHosts,
      Remove: API.removeHosts,
      Get: API.getHosts
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

    PenPal.API.Services = {
      Upsert: API.upsertServices,
      Remove: API.removeServices,
      Get: API.getServices
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
