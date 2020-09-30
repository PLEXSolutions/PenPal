import { types, resolvers, loaders } from "./graphql";

const settings = {
  configuration: {
    schema_root: "BurpsuiteProConfiguration",
    getter: "getBurpsuiteProConfiguration",
    setter: "setBurpsuiteProConfiguration"
  },
  /*n8n: {
    displayName: "Burpsuite Pro",
    name: "burpsuitePro",
    icon: "fa:question-circle",
    description: "Interact with the PenPal Burpsuite Pro plugin",
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Vulnerability scan",
            value: "vuln_scan",
            description: "Start a vulnerability scan of the input URL"
          }
        ]
      }
    ]
  },*/
  datastores: [
    {
      name: "settings"
    }
  ]
};

const BurpsuiteProPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default BurpsuiteProPlugin;
