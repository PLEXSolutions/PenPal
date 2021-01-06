import PenPal from "meteor/penpal";

export default {
  NetworkService: {
    __resolveType(obj, context, info) {
      switch (true) {
        default:
          return "GenericNetworkService";
      }
    }
  }
};
