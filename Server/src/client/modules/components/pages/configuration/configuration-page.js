import React from "react";

import { Components, registerComponent } from "../../../components.js";

const HChooser = ({ depth, children }) =>
  depth === 0 ? (
    <h2>{children}</h2>
  ) : depth === 1 ? (
    <h3>{children}</h3>
  ) : depth === 2 ? (
    <h4>{children}</h4>
  ) : (
    <div>{children}</div>
  );

const process_schema = (types, schema_root, depth = 0) => {
  let components = [];
  let query = {};

  for (field of schema_root.fields) {
    if (field.type.kind === "SCALAR" || field.type.ofType?.kind === "SCALAR") {
      components.push(<div>{`${field.name} --- ${field.type.name}`}</div>);
      query[field.name] = "";
    } else {
      components.push(<HChooser depth={depth}>{field.name}</HChooser>);
      if (field.type.kind === "LIST") {
        const [_components, _query] = process_schema(
          types,
          types[field.type.ofType.name],
          depth + 1
        );
        components = components.concat(_components);
        query[field.name] = _query;
      } else {
        const [_components, _query] = process_schema(
          types,
          types[field.type.name],
          depth + 1
        );
        components = components.concat(_components);
        query[field.name] = _query;
      }
    }
  }

  return [components, query];
};

const ConfigurationPage = ({ types, queries, mutations, plugin }) => {
  const schema_root = types[plugin.settings.configuration.schema_root];
  const [processed_schema, query] = process_schema(types, schema_root);

  console.log(JSON.stringify(query, null, 4));

  return <div>{processed_schema}</div>;
};

registerComponent("ConfigurationPage", ConfigurationPage);
