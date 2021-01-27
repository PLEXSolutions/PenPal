import { CachingDefaultResolvers } from "./common.js";

export default {
  Network: {
    ...CachingDefaultResolvers("Networks", ["subnet", "domain"]),

    async hostsConnection({ id }, args, { PenPalCachingAPI }) {
      const network = await PenPalCachingAPI.Networks.Get(id);
      return { hosts: network.hosts, args };
    }
  },

  NetworksConnection: {
    async edges({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      const networks = await PenPalCachingAPI.Networks.GetMany(network_ids);
      return networks.map((network) => ({ cursor: network.id, node: network }));
      return result;
    },

    async networks({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      const networks = await PenPalCachingAPI.Networks.GetMany(network_ids);
      return networks;
    },

    async pageInfo({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      const {
        startCursor,
        startCursorOffset,
        endCursor,
        endCursorOffset,
        totalCount
      } = await PenPalCachingAPI.Networks.GetPaginationInfo(network_ids, args);

      return {
        hasPreviousPage: startCursorOffset > 0,
        hasNextPage: endCursorOffset < totalCount - 1,
        startCursor,
        startCursorOffset,
        endCursor,
        endCursorOffset
      };
    },

    async totalCount({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      const { totalCount } = await PenPalCachingAPI.Networks.GetPaginationInfo(
        network_ids,
        args
      );
      return totalCount;
    }
  }
};
