import _ from "lodash";
import gql from "graphql-tag";
import {
  query as queryBuilder,
  mutation as mutationBuilder
} from "gql-query-builder";

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

export const generateQueryFromSchema = (types, schema_root, query_name) => {
  if (types === false || schema_root === false || query_name === false) {
    return gql`
      {
        nop
      }
    `;
  }
  const query_config = process_schema(types, types[schema_root]);
  query_config.operation = query_name;
  const { query } = queryBuilder(query_config);
  return gql`
    ${query}
  `;
};

export const generateMutationFromSchema = (types, mutations, mutation_name) => {
  if (types === false || mutations === false || mutation_name === false) {
    return gql`
      mutation {
        nop
      }
    `;
  }
  const mutation_schema = mutations[mutation_name];
  const variables = _.chain(mutation_schema.args)
    .keyBy("name")
    .mapValues(variable => ({
      value: "",
      type: variable.type.name
    }))
    .value();
  const { fields } = process_schema(types, types[mutation_schema.type.name]);

  const mutation_config = {
    operation: mutation_name,
    variables,
    fields
  };

  const { query: mutation } = mutationBuilder(mutation_config);

  return gql`
    ${mutation}
  `;
};
