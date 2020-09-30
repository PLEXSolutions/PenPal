import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";

export default {
  Service: {
    host(service) {
      return PenPal.DataStore.fetch("CoreAPI", "Hosts", {
        _id: new Mongo.ObjectID(service.hostID),
      })[0];
    },
  },
};
