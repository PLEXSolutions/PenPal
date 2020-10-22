import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";

export default {
  Project: {
    customer(project) {
      const { _id, ...rest } = PenPal.DataStore.fetchOne(
        "CoreAPI",
        "Customers",
        {
          _id: new Mongo.ObjectID(project.customer)
        }
      );
      return { id: project.customer, ...rest };
    }
  }
};
