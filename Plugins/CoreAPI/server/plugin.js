import { types, resolvers, loaders } from "./graphql";
import _ from "lodash";

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
    // Create datastores
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default CoreAPIPlugin;
