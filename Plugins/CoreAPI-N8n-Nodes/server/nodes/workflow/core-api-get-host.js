const host_ids_variable_field = "host_ids";
const project_id_variable_field = "project_id";
const ipv4_graphql_field = "ip_address";
const mac_graphql_field = "mac_address";
const hostnames_graphql_field = "hostnames";

export default {
  executeHandler: "coreAPIGetHostData",
  executeHandlerType: "query", // 'query' | 'mutation'
  variables: [host_ids_variable_field, project_id_variable_field],
  fields: [ipv4_graphql_field, mac_graphql_field, hostnames_graphql_field],
  node: {
    displayName: "(PenPal) Get Host Data",
    name: "CoreAPIGetHost",
    icon: "fa:desktop",
    description:
      "Retrieve information for hosts from the PenPal server. This is best used to retrieve details for things like sending Slack notification.",
    properties: [
      {
        displayName: "Project ID",
        name: project_id_variable_field,
        type: "string",
        default: "",
        description:
          "The field that represents the project ID coming into this node",
        required: true
      },
      {
        displayName: "Host IDs",
        name: host_ids_variable_field,
        type: "string",
        default: "",
        description:
          "The field that represents the host ID coming into this node",
        required: true
      },
      {
        displayName: "IP Address",
        name: ipv4_graphql_field,
        type: "boolean",
        default: true,
        description: "Host IP Address"
      },
      {
        displayName: "MAC Address",
        name: mac_graphql_field,
        type: "boolean",
        default: false,
        description: "Host MAC Address"
      },
      {
        displayName: "Hostname(s)",
        name: hostnames_graphql_field,
        type: "boolean",
        default: true,
        description: "One or more hostnames"
      }
    ]
  }
};
