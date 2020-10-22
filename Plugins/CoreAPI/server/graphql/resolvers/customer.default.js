import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";

export default {
  Customer: {
    async projects({ projects = [] }, args, context) {
      if (projects.length === 0) {
        return [];
      }

      const customer_projects = await PenPal.DataStore.fetch(
        "CoreAPI",
        "Projects",
        {
          _id: { $in: projects.map(id => new Mongo.ObjectID(id)) }
        }
      );

      return customer_projects.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest
      }));
    }
  }
};
