import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

export default {
  async getCoreAPIConfiguration(root, args, context) {
    let hookURL =
      PenPal.DataStore.fetch("CoreAPI", "Configuration", {})[0]?.hookURL ?? "";
    return {
      hookURL
    };
  },
  async getCustomers(root, args, context) {
    let res = PenPal.API.Customers.Get(args);
    return res;
  },
  async getHosts(root, args, context) {
    let res = PenPal.API.Hosts.Get(args);
    return res;
  },
  async getHost(root, args, context) {
    let res = PenPal.API.Hosts.Get(args);
    return res;
  },
  async getProjects(root, args, context) {
    let res = PenPal.API.Projects.GetMany();
    return res;
  },
  async getProject(root, args, context) {
    let res = PenPal.API.Projects.Get(args);
    return res;
  },
  async getServices(root, args, context) {
    let res = PenPal.API.Services.Get(args);
    return res;
  },
  async getService(root, args, context) {
    let res = PenPal.API.Services.Get(args);
    return res;
  }
};
