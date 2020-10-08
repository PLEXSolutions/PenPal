import PenPal from "meteor/penpal";
import Mongo from "meteor/mongo";
export default {
  Host: {
    services(host) {
      return PenPal.DataStore.fetch("CoreAPI", "Services", {
        hostID: host._id._str,
      });
    },
    project(host) {
      return PenPal.API.Projects.Get({ id: host.projectID });
    },
  },
};
