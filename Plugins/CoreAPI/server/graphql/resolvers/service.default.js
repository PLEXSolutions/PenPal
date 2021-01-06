import PenPal from "meteor/penpal";

export default {
  Service: {
    __resolveType(obj, context, info) {
      switch (true) {
        case obj.ip_protocol !== undefined:
          return "NetworkService";
      }
    }
  }
};
