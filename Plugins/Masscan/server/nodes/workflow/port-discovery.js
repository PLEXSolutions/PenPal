import PenPal from "meteor/penpal";
import mutations from "../../graphql/resolvers/mutations.js";

const buildNode = () =>
  PenPal.N8n.NodeBuilder()
    .displayName("(Masscan) Port Discovery")
    .name("MasscanPortDiscovery")
    .icon("fa:shipping-fast")
    .description("Perform a port discovery scan using the masscan tool")
    .addMutationHandler(mutations.performMasscan)
    .addVariable((variable) =>
      variable
        .displayName("Project ID")
        .name("project_id")
        .description("Project ID of the hosts to scan")
        .required()
    )
    .addVariable((variable) =>
      variable
        .displayName("IP Addresses")
        .name("ips")
        .description("A comma separated list of IP addresses to scan")
        .required()
    )
    .addVariable((variable) =>
      variable
        .displayName("Ports")
        .name("ports")
        .default("22,53,139,80,443,445,8080")
        .description("A comma separated list of ports to scan on each host")
        .required()
    )
    .addVariable((variable) =>
      variable
        .displayName("Scan Rate")
        .name("scanRate")
        .type("number")
        .default(1000)
        .description("Rate of scan to perform in packers per second")
        .required()
    )
    .value();

export default buildNode;
