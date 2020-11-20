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
  },

  HostsConnection: {
    async edges({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      console.log(host_ids, args);
      const hosts = await PenPalCachingAPI.Hosts.GetMany(host_ids);
      return hosts.map(host => ({ cursor: host.id, node: host }));
      return result;
    },

    async hosts({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      console.log(host_ids, args);
      const hosts = await PenPalCachingAPI.Hosts.GetMany(host_ids);
      return hosts;
    },

    async pageInfo({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      console.log(host_ids, args);
      const hosts = await PenPalCachingAPI.Hosts.GetMany(host_ids);

      return {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: hosts[0]?.id ?? "",
        endCursor: hosts[hosts.length - 1]?.id ?? ""
      };
    },

    async totalCount({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      console.log(host_ids, args);
      return host_ids.length;
    }
  }
};
