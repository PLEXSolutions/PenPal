import { CachingDefaultResolvers } from "./common.js";

export default {
  Host: {
    ...CachingDefaultResolvers("Hosts", [
      "ip_address",
      "mac_address",
      "hostnames"
    ]),

    async project({ id }, args, { PenPalCachingAPI }) {
      const { project } = await PenPalCachingAPI.Hosts.Get(id);
      return await PenPalCachingAPI.Projects.Get(project);
    }
  },

  HostsConnection: {
    async edges({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      const hosts = await PenPalCachingAPI.Hosts.GetMany(host_ids, args);
      return hosts.map(host => ({ cursor: host.id, node: host }));
      return result;
    },

    async hosts({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      const hosts = await PenPalCachingAPI.Hosts.GetMany(host_ids, args);
      return hosts;
    },

    async pageInfo({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      const {
        startCursor,
        startCursorOffset,
        endCursor,
        endCursorOffset,
        totalCount
      } = await PenPalCachingAPI.Hosts.GetPaginationInfo(host_ids, args);

      return {
        hasPreviousPage: startCursorOffset > 0,
        hasNextPage: endCursorOffset < totalCount - 1,
        startCursor,
        startCursorOffset,
        endCursor,
        endCursorOffset
      };
    },

    async totalCount({ hosts: host_ids, args }, _, { PenPalCachingAPI }) {
      const { totalCount } = await PenPalCachingAPI.Hosts.GetPaginationInfo(
        host_ids,
        args
      );
      return totalCount;
    }
  }
};
