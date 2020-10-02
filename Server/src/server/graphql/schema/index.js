import { mergeTypeDefs } from "@graphql-tools/merge";

import mutations from "./mutations";
import queries from "./queries";
import n8n_typeDefs from "./n8n.graphql";
import webapp_typeDefs from "./webapp.graphql";
import typeDefs from "./schema.graphql";

const types = [mutations, queries, typeDefs, n8n_typeDefs, webapp_typeDefs];

export default mergeTypeDefs(types);
