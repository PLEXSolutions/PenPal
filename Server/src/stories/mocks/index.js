import get_customers_mocks from "./get-customers.js";
import get_project_summaries from "./get-project-summaries.js";
import introspection_mocks from "./introspection.js";

export default [
  ...get_customers_mocks,
  ...get_project_summaries,
  ...introspection_mocks
];
