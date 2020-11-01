import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import PenPal from "meteor/penpal";

export default {
  Project: {
    async customer({ customer }) {
      const customer_data = await PenPal.API.Customers.Get(customer);

      if (customer_data === undefined) {
        throw new Meteor.Error(
          404,
          `Customer not found for project ${project.id}`
        );
      }

      return { id: customer, ...customer_data };
    },

    async scope({ scope: { hosts, networks } }) {
      const result = {
        hosts: await PenPal.API.Hosts.GetMany(hosts),
        networks: null
      };
      return result;
    }
  }
};
