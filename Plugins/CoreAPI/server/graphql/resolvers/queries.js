import PenPal from "meteor/penpal";

export default {
  async getCoreAPIConfiguration(root, args, context) {
    let hookURL =
      PenPal.DataStore.fetch("CoreAPI", "Configuration", {})[0]?.hookURL ?? "";
    return {
      hookURL
    };
  },
  async getCustomers(root, args, context) {
    return await PenPal.API.Customers.GetMany();
  },
  async getCustomer(root, { id }, context) {
    return await PenPal.API.Customers.Get({ id });
  },
  async getHosts(root, args, context) {
    // TODO: Update for new API functionality
    return await PenPal.API.Hosts.Get(args);
  },
  async getHost(root, args, context) {
    // TODO: Update for new API functionality
    return await PenPal.API.Hosts.Get(args);
  },
  async getServices(root, args, context) {
    // TODO: Update for new API functionality
    return await PenPal.API.Services.Get(args);
  },
  async getService(root, args, context) {
    // TODO: Update for new API functionality
    return await PenPal.API.Services.Get(args);
  }
};
