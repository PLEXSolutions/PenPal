import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";

export default {
  async getCoreAPIConfiguration(root, args, context) {
    let hookURL = PenPal.DataStore.fetch("CoreAPI", "Configuration", {})[0]
      .hookURL;
    return {
      hookURL,
    };
  },
  async getHosts(root, args, context) {
    return PenPal.DataStore.fetch("CoreAPI", "Hosts", {
      "projectID": new Mongo.ObjectID(args.projectID),
    });
  },
  async getHost(root, args, context) {
    return PenPal.DataStore.fetch("CoreAPI", "Hosts", {
      _id: `${args.id}`,
    })[0];
  },
  async getProjects(root, args, context) {
    return PenPal.DataStore.fetch("CoreAPI`", "Projects", {});
  },
  async getProject(root, args, context) {
    return PenPal.DataStore.fetch("CoreAPI", "Projects", {
      _id: `${args.id}`,
    })[0];
  },
  async getServices(root, args, context) {
    return PenPal.DataStore.fetch("CoreAPI", "Services", {});
  },
  async getService(root, args, context) {
    return PenPal.DataStore.fetch("CoreAPI","Services",{"_id":`${args.id}`})[0]
  },
};
