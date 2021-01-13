import { types, resolvers, loaders } from "./graphql";
import dockerfile from './Dockerfile.js';

const settings = {
  docker: {
    name: "masscan",
    dockerfile,
  },
  n8n: {
    workflow_nodes: [
      {
        executeHandler: "performMasscan",
        executeHandlerType: "mutation",
        variables: ["projectID", "ips", "ports", "scanRate"],
        fields: ["was_success"],
        node: {
          displayName: "Masscan",
          name: "MasscanPlugin",
          icon: "fa:question-circle",
          description: "Perform masscan for specified host(s)",
          properties: [
            {
              displayName: "Project ID",
              name: "projectID",
              type: "string",
              default: "",
              description: "Project ID of Host to Masscan",
              required: true,
            },
            {
              displayName: "IP Addresses",
              name: "ips",
              type: "string",
              default: "",
              description: "A comma seperated list of IPv4 addresses to scan",
              required: true,
            },
            {
              displayName: "Ports",
              name: "ports",
              type: "string",
              default: "80,443",
              description:
                "A comma seperated list of ports to scan on each host",
              required: true,
            },
            {
              displayName: "Scan Rate",
              name: "scanRate",
              type: "number",
              default: "1000",
              description:
                "Rate of scan to perform (provided in packets per second (pps))",
              required: true,
            },
            {
              displayName: "Successful",
              name: "was_success",
              type: "boolean",
              default: true,
              description:
                "Masscan tasked successfully",
              required: true,
            },
          ],
        },
      },
    ],
  },
};

const MasscanPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders: {},
      settings,
    };
  },
};

export default MasscanPlugin;
