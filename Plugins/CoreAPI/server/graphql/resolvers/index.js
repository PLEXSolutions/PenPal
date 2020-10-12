import annotatable_default_resolvers from "./annotatable.default.js";
//import host_default_resolvers from "./host.default";
import mutation_resolvers from "./mutations.js";
import network_service_default_resolvers from "./network_service.default.js";
import query_resolvers from "./queries.js";
import service_default_resolvers from "./service.default.js";

export default {
  queries: query_resolvers,
  mutations: mutation_resolvers,
  default_resolvers: [
    annotatable_default_resolvers,
    network_service_default_resolvers,
    service_default_resolvers
  ]
  // scalars: scalar_resolvers
};
