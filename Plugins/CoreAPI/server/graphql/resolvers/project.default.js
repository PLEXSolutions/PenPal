import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import PenPal from "meteor/penpal";

export default {
  Project: {
    customer(project) {
      const customer = PenPal.DataStore.fetchOne("CoreAPI", "Customers", {
        _id: new Mongo.ObjectID(project.customer)
      });

      if (customer === undefined) {
        throw new Meteor.Error(
          404,
          `Customer not found for project ${project.id}`
        );
      }

      return { id: project.customer, ...customer };
    }
  }
};
