import { CachingDefaultResolvers } from "./common.js";

export default {
  Customer: {
    ...CachingDefaultResolvers("Customers", ["name", "industry"]),

    async projectsConnection({ id }, args, { PenPalCachingAPI }) {
      const { projects = [] } = await PenPalCachingAPI.Customers.Get(id);
      const customer_projects = await PenPalCachingAPI.Projects.GetMany(
        projects
      );
      return { projects: customer_projects, args };
    }
  }
};
