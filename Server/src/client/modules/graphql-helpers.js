import gql from "graphql-tag";
import { query as queryBuilder } from "gql-query-builder";

export const process_schema = (types, schema_root, depth = 0) => {
  let query = {};

  query.fields = [];
  for (let field of schema_root.fields) {
    if (field.type.kind === "SCALAR" || field.type.ofType?.kind === "SCALAR") {
      query.fields.push(field.name);
    } else {
      if (field.type.kind === "LIST") {
        const _query = process_schema(
          types,
          types[field.type.ofType.name],
          depth + 1
        );
        query.fields.push({ [field.name]: _query });
      } else {
        const _query = process_schema(types, types[field.type.name], depth + 1);
        query.fields.push({ [field.name]: _query });
      }
    }
  }

  return depth === 0 ? query : query.fields;
};

export const generateGqlFromSchema = (types, schema_root, query_name) => {
  const query_config = process_schema(types, types[schema_root]);
  query_config.operation = query_name;
  const { query } = queryBuilder(query_config);
  return gql`
    ${query}
  `;
};
