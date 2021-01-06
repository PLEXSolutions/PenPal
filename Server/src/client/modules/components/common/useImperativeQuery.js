import React from "react";
import { useApolloClient } from "@apollo/client";
import { registerHook } from "../../hooks.js";

const useImperativeQuery = (query) => {
  const client = useApolloClient();

  const imperativelyCallQuery = async (variables) => {
    return await client.query({ query, variables });
  };

  return imperativelyCallQuery;
};

registerHook("useImperativeQuery", useImperativeQuery);
