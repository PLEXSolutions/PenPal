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
  upsertServices
} from "./api-functions";

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
  ],
  n8n: {
    workflow_nodes: [
      {
        executeHandler: "coreAPIUpdateHost",
        node: {
          displayName: "PenPal Update Host",
          name: "CoreAPIUpdateHost",
          icon: "fa:edit",
          description:
            "Send information to the PenPal server for the given host",
          properties: [
            {
              displayName: "Host",
              name: "host",
              type: "string",
              default: "",
              description: "The host ID that the new data belongs to",
              required: true
            }
          ]
        }
      }
    ],
    trigger_nodes: [
      {
        trigger_name: "CoreAPINewHost",
        node: {
          displayName: "PenPal New Host Trigger",
          name: "CoreAPINewHost",
          icon: "fa:desktop",
          description:
            "Webhook that will get called when a new host is added to PenPal",
          properties: []
        }
      }
    ]
  }
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

    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default CoreAPIPlugin;
