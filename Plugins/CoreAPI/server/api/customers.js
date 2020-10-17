import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

export async function upsertCustomers({ customers }) {
  const affected_records = [];
  const insert_customers = [];
  const update_customers = [];

  for (let customer of customers) {
    if (customer.id !== undefined) {
      // Update for id
      update_customers.push(customer);
    } else {
      // New Customer
      insert_customers.push(customer);
    }
  }

  for (let { id, ...rest } of update_customers) {
    let res = await PenPal.DataStore.update(
      "CoreAPI",
      "Customers",
      { _id: new Mongo.ObjectID(id) },
      rest
    );
    if (res > 0) affected_records.push(id);
  }

  if (insert_customers.length > 0) {
    let res = await PenPal.DataStore.insertMany(
      "CoreAPI",
      "Customers",
      insert_customers
    );
    _.each(res.insertedIds, k => affected_records.push(k));
  }

  return {
    status: "Customers Updated",
    was_success: true,
    affected_records
  };
}

export async function removeCustomers(args) {
  const response = {
    status: "Not yet implemented",
    was_success: false,
    affected_records: []
  };

  return response;
}

export async function getCustomers(args) {
  let res = await PenPal.DataStore.fetch("CoreAPI", "Customers", {});
  // TODO: uncouple the "id" logic from Mongo DB by having that occur in the DataStore layer
  return res.map(customer => ({ id: customer._id, ...customer }));
}
