import { mergeTypeDefs } from "@graphql-tools/merge";

import n8n_mutations from "./n8n.graphql";
import webapp_mutations from "./webapp.graphql";

const mutations = [n8n_mutations, webapp_mutations];

export default mergeTypeDefs(mutations);
