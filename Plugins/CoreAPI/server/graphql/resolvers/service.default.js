import PenPal from "meteor/penpal";

export default {
  Service: {
    host(service) {
      return PenPal.API.Hosts.Get({ id: service.hostID });
    },
    project(service) {
      return PenPal.API.Projects.Get({ id: service.projectID });
    },
  },
};
