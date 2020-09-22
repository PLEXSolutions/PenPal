import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import ApolloClient from "apollo-client";
import {
  IntrospectionFragmentMatcher,
  InMemoryCache
} from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";

const introspect_schema = async () => {
  const result = await fetch(`http://localhost:3000/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      variables: {},
      query: `
        {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `
    })
  });

  const result_json = await result.json();

  // here we're filtering out any type information unrelated to unions or interfaces
  const filteredData = result_json.data.__schema.types.filter(
    type => type.possibleTypes !== null
  );

  result_json.data.__schema.types = filteredData;

  return result_json.data;
};

const apolloInit = async () => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: await introspect_schema()
  });
  const cache = new InMemoryCache({ fragmentMatcher });

  const auth_link = new ApolloLink((operation, forward) => {
    const token = Accounts._storedLoginToken();
    //console.log(`Sending request with auth: ${token}`, operation);

    if (token) {
      operation.setContext(() => ({
        headers: {
          authorization_token: token
        }
      }));
    }

    return forward(operation);
  });

  const batch_link = new BatchHttpLink();

  const apollo_client = new ApolloClient({
    cache,
    link: ApolloLink.from([auth_link, batch_link])
  });

  return apollo_client;
};

export default apolloInit;
