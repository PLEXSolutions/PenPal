import PenPal from "meteor/penpal";

export default {
  async getCoreAPIConfiguration(root, args, { PenPalCachingAPI }) {
    let hookURL =
      PenPal.DataStore.fetch("CoreAPI", "Configuration", {})[0]?.hookURL ?? "";
    return {
      hookURL
    };
  },
  async getServices(root, args, { PenPalCachingAPI }) {
    // TODO: Update for new API functionality
    return await PenPalCachingAPI.Services.Get(args);
  },
  async getService(root, args, { PenPalCachingAPI }) {
    // TODO: Update for new API functionality
    return await PenPalCachingAPI.Services.Get(args);
  }
};
