import { CachingDefaultResolvers } from "./common.js";

export default {
  Host: {
    ...CachingDefaultResolvers("Hosts", [
      "ip_address",
      "mac_address",
      "hostnames"
    ]),

    project({ project }, args, { PenPalCachingAPI }) {
      return PenPalCachingAPI.Projects.Get(host.project);
    }
  }
};
