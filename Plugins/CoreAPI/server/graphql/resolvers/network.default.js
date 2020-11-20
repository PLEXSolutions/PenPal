import { CachingDefaultResolvers } from "./common.js";

export default {
  Network: {
    ...CachingDefaultResolvers("Networks", ["subnet", "domain"]),

    async hosts({ id }, args, { PenPalCachingAPI }) {
      return await PenPalCachingAPI.Hosts.GetManyByNetworkID(id);
    }
  },

  NetworksConnection: {
    async edges({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      const networks = await PenPalCachingAPI.Networks.GetMany(network_ids);
      return networks.map(network => ({ cursor: network.id, node: network }));
      return result;
    },

    async networks({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      const networks = await PenPalCachingAPI.Networks.GetMany(network_ids);
      return networks;
    },

    async pageInfo({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      const networks = await PenPalCachingAPI.Networks.GetMany(network_ids);

      return {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: networks[0]?.id ?? "",
        endCursor: networks[networks.length - 1]?.id ?? ""
      };
    },

    async totalCount({ networks: network_ids, args }, _, { PenPalCachingAPI }) {
      return network_ids.length;
    }
  }
};
