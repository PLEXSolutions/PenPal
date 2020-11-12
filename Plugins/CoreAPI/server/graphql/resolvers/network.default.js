import { CachingDefaultResolvers } from "./common.js";

export default {
  Network: {
    ...CachingDefaultResolvers("Networks", ["subnet", "domain"]),

    async hosts({ id, hosts }, args, { PenPalCachingAPI }) {
      return await PenPalCachingAPI.Hosts.GetManyByNetworkID(id);
    }
  }
};
