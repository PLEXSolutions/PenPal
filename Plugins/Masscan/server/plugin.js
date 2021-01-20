import { types, resolvers, loaders } from "./graphql";
import dockerfile from "./Dockerfile.js";

import { workflow_nodes } from "./nodes";

const settings = {
  docker: {
    name: "masscan",
    dockerfile
  },
  n8n: {
    workflow_nodes
  }
};

const MasscanPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default MasscanPlugin;
