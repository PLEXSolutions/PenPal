import { CachingDefaultResolvers } from "./common.js";

export default {
  Customer: {
    ...CachingDefaultResolvers("Customers", ["name", "industry"]),

    async projects({ projects = [] }, args, { PenPalCachingAPI }) {
      const customer_projects = await PenPalCachingAPI.Projects.GetMany(
        projects
      );
      return customer_projects;
    }
  }
};
