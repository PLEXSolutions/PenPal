import { CachingDefaultResolvers } from "./common.js";

export default {
  Project: {
    ...CachingDefaultResolvers("Projects", [
      "name",
      "description",
      "dates",
      "scope"
    ]),

    async customer({ customer }, args, { PenPalCachingAPI }) {
      const customer_data = await PenPalCachingAPI.Customers.Get(customer);

      if (customer_data === undefined) {
        throw new Meteor.Error(
          404,
          `Customer not found for project ${project.id}`
        );
      }

      return { id: customer, ...customer_data };
    }
  },

  ProjectScope: {
    // We pass thru the args here to the connection default resolvers so they can actually do the appropriate fetching
    async hostsConnection({ hosts }, args, { PenPalCachingAPI }) {
      return { hosts, args };
    },

    // We pass thru the args here to the connection default resolvers so they can actually do the appropriate fetching
    async networksConnection({ networks }, args, { PenPalCachingAPI }) {
      return { networks, args };
    }
  }
};
