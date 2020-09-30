import PenPal from "meteor/penpal";
export default {
  Host: {
    services(host) {
      return PenPal.DataStore.fetch("CoreAPI", "Services", {
        hostID: host._id._str,
      });
    },
  },
};
