import scalar_resolvers from "./scalars.js";
import n8n_query_resolvers from "./n8n.queries.js";
import n8n_mutation_resolvers from "./n8n.mutations.js";
import webapp_mutation_resolvers from "./webapp.mutations.js";
import webapp_query_resolvers from "./webapp.queries.js";
import webapp_users_default_resolvers from "./webapp.default.js";

export default {
  queries: {
    ...n8n_query_resolvers,
    ...webapp_query_resolvers
  },
  mutations: {
    ...n8n_mutation_resolvers,
    ...webapp_mutation_resolvers
  },
  default_resolvers: [webapp_users_default_resolvers],
  scalars: scalar_resolvers
};
