import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { applyMiddleware } from "graphql-middleware";
import { WebApp } from "meteor/webapp";
import _ from "lodash";

import { getUser } from "./get-meteor-user.js";
import { types, resolvers, buildLoaders } from "./graphql";

const startGraphQLServer = (
  plugins_types = {},
  plugins_resolvers = {},
  plugins_buildLoaders = () => null
) => {
  const _resolvers = _.merge(resolvers, plugins_resolvers);
  const _typeDefs = mergeTypeDefs([types, plugins_types]);

  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs: _typeDefs,
      resolvers: _resolvers,
      inheritResolversFromInterfaces: true
    })
  );

  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: async ({ req }) => {
      let loaders = {};
      loaders = _.extend(loaders, buildLoaders());
      loaders = _.extend(loaders, plugins_buildLoaders());

      const user = await getUser(req.headers.authorization_token);

      if (user !== undefined) {
        user.id = user._id;
        await loaders.webappUsersLoader.prime(user.id, user);
      }

      return {
        user: user,
        loaders
      };
    }
  });

  console.log("Starting GraphQL Server");
  server.applyMiddleware({
    app: WebApp.connectHandlers,
    path: "/graphql"
  });

  WebApp.connectHandlers.use("/graphql", (req, res) => {
    if (req.method === "GET") {
      res.end();
    }
  });
};

export default startGraphQLServer;
