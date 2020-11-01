import PenPal from "meteor/penpal";

export default {
  Host: {
    project(host) {
      return PenPal.API.Projects.Get(host.project);
    }
  }
};
