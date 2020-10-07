import { types, resolvers, loaders } from "./graphql";
import _ from "lodash";
import PenPal from "meteor/penpal";

const settings = {
  n8n: {
    workflow_nodes: [
      {
        executeHandler: "coreAPIGetHostData",
        executeHandlerType: "query", // 'query' | 'mutation'
        variables: ["host_ids"],
        fields: ["ipv4", "mac", "hostnames"],
        node: {
          displayName: "(PenPal) Get Host Data",
          name: "CoreAPIGetHost",
          icon: "fa:desktop",
          description:
            "Retrieve information for hosts from the PenPal server. This is best used to retrieve details for things like sending Slack notification.",
          properties: [
            {
              displayName: "Host IDs",
              name: "host_ids",
              type: "string",
              default: "",
              description:
                "The field that represents the host ID coming into this node",
              required: true
            },
            {
              displayName: "IP Address",
              name: "ipv4",
              type: "boolean",
              default: true,
              description: "Host IP Address"
            },
            {
              displayName: "MAC Address",
              name: "mac",
              type: "boolean",
              default: false,
              description: "Host MAC Address"
            },
            {
              displayName: "Hostname(s)",
              name: "hostnames",
              type: "boolean",
              default: true,
              description: "One or more hostnames"
            }
          ]
        }
      }
    ],
    trigger_nodes: [
      {
        trigger: {
          name: "CoreAPI.new.host",
          type: "host",
          trigger: "new"
        },
        node: {
          displayName: "(PenPal) New Host Trigger",
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

const CoreAPIN8nNodesPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings
    };
  }
};

export default CoreAPIN8nNodesPlugin;
