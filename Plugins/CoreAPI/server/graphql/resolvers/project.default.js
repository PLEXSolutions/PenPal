import { CachingDefaultResolvers } from "./common.js";

export default {
  Project: {
    ...CachingDefaultResolvers("Projects", ["name", "description", "dates"]),

    async customer({ customer }, args, { PenPalCachingAPI }) {
      const customer_data = await PenPalCachingAPI.Customers.Get(customer);

      if (customer_data === undefined) {
        throw new Meteor.Error(
          404,
          `Customer not found for project ${project.id}`
        );
      }

      return { id: customer, ...customer_data };
    },

    async scope({ scope: { hosts, networks } }, args, { PenPalCachingAPI }) {
      const result = {
        hosts: await PenPalCachingAPI.Hosts.GetMany(hosts),
        networks: await PenPalCachingAPI.Networks.GetMany(networks)
      };

      return result;
    }
  }
};
