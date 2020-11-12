import { CachingDefaultResolvers } from "./common.js";

export default {
  Host: {
    ...CachingDefaultResolvers("Hosts", [
      "ip_address",
      "mac_address",
      "hostnames"
    ]),

    async project({ project }, args, { PenPalCachingAPI }) {
      return await PenPalCachingAPI.Projects.Get(host.project);
    }
  }
};
