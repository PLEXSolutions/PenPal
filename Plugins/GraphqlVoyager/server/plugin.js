import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import { WebApp } from "meteor/webapp";

const GraphqlVoyagerPlugin = {
  loadPlugin() {
    return {
      types: {},
      resolvers: {},
      loaders: {},
      settings: {}
    };
  },

  startupHook() {
    console.log("[.] Starting GraphQL Voyager");
    WebApp.connectHandlers.use(
      "/voyager",
      voyagerMiddleware({ endpointUrl: "/graphql" })
    );
  }
};

export default GraphqlVoyagerPlugin;
