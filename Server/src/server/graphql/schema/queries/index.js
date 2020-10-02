import { mergeTypeDefs } from "@graphql-tools/merge";

import n8n_queries from "./n8n.graphql";
import webapp_queries from "./webapp.graphql";

const queries = [n8n_queries, webapp_queries];

export default mergeTypeDefs(queries);
