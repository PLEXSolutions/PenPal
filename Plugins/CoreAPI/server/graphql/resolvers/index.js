// import scalar_resolvers from "./scalars.js";
import query_resolvers from "./queries.js";
import mutation_resolvers from "./mutations.js";
import host_default_resolvers from "./host.default";
import service_default_resolvers from './service.default';

export default {
  queries: query_resolvers,
  mutations: mutation_resolvers,
  default_resolvers: [host_default_resolvers,service_default_resolvers],
  // scalars: scalar_resolvers
};
