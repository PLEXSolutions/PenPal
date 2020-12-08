import { CachingDefaultResolvers } from "./common.js";

export default {
  Project: {
    ...CachingDefaultResolvers("Projects", [
      "name",
      "description",
      "dates",
      "scope"
    ]),

    async customer({ id }, args, { PenPalCachingAPI }) {
      const { customer } = await PenPalCachingAPI.Projects.Get(id);
      const customer_data = await PenPalCachingAPI.Customers.Get(customer);

      if (customer_data === undefined) {
        throw new Meteor.Error(404, `Customer not found for project ${id}`);
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
  },

  ProjectsConnection: {
    async edges({ args }, _, { PenPalCachingAPI }) {
      const projects = await PenPalCachingAPI.Project.GetMany([], args);
      return projects.map(project => ({ cursor: project.id, node: project }));
      return result;
    },

    async projects({ args }, _, { PenPalCachingAPI }) {
      console.log("Getting projects", args);
      const projects = await PenPalCachingAPI.Projects.GetMany([], args);
      return projects;
    },

    async pageInfo({ args }, _, { PenPalCachingAPI }) {
      const projects = await PenPalCachingAPI.Projects.GetMany([], args);

      return {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: projects[0]?.id ?? "",
        endCursor: projects[projects.length - 1]?.id ?? ""
      };
    },

    async totalCount({ args }, _, { PenPalCachingAPI }) {
      return -1;
    }
  }
};
