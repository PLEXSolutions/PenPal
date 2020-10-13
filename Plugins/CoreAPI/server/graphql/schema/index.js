import { mergeTypeDefs } from "@graphql-tools/merge";

import analytics from "./analytics.graphql";
import mutations from "./mutations.graphql";
import queries from "./queries.graphql";
import typeDefs from "./schema.graphql";

const types = [analytics, mutations, queries, typeDefs];

export default mergeTypeDefs(types);
