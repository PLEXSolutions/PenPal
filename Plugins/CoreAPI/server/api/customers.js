import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";
import { required_field } from "./common.js";

// -----------------------------------------------------------

export const getCustomer = async customer_id => {
  return await PenPal.DataStore.fetchOne("CoreAPI", "Customers", {
    _id: new Mongo.ObjectID(customer_id)
  });
};

export const getCustomers = async (customer_ids = []) => {
  let result = [];

  if (customer_ids.length === 0) {
    result = await PenPal.DataStore.fetch("CoreAPI", "Customers", {});
  } else {
    result = await PenPal.DataStore.fetch("CoreAPI", "Customers", {
      _id: { $in: customer_ids.map(id => new Mongo.ObjectID(id)) }
    });
  }
  // TODO: uncouple the "id" logic from Mongo DB by having that occur in the DataStore layer
  return result.map(customer => ({ id: customer._id, ...customer }));
};

// -----------------------------------------------------------

const default_customer = {
  projects: []
};

export const insertCustomer = async customer => {
  return await insertCustomers([customer]);
};

export const insertCustomers = async customers => {
  const rejected = [];
  const _accepted = [];
  const accepted = [];

  for (let customer of customers) {
    try {
      required_field(customer, "name", "insertion");
      required_field(customer, "industry", "insertion");
      _accepted.push({ ...default_customer, ...customer });
    } catch (e) {
      rejected.push({ customer, error: e });
    }
  }

  if (_accepted.length > 0) {
    let res = await PenPal.DataStore.insertMany(
      "CoreAPI",
      "Customers",
      _accepted
    );

    // TODO: currently coupled to Mongo. DataStore should abstract this away
    _.each(res.ops, ({ _id, ...rest }) =>
      accepted.push({ id: String(_id), ...rest })
    );
  }

  return { accepted, rejected };
};

// -----------------------------------------------------------

export const updateCustomer = async customer => {
  return await updateCustomers([customer]);
};

export const updateCustomers = async customers => {
  const rejected = [];
  const _accepted = [];
  const accepted = [];

  for (let customer of customers) {
    try {
      required_field(customer, "id", "update");
      _accepted.push(customer);
    } catch (e) {
      rejected.push({ customer, error: e });
    }
  }

  let matched_customers = await PenPal.DataStore.fetch("CoreAPI", "Customers", {
    _id: { $in: _accepted.map(customer => new Mongo.ObjectID(customer.id)) }
  });

  if (matched_customers.length !== _accepted.length) {
    // Find the unknown IDs
    console.error(
      'Implement updateCustomers "customer not found" functionality'
    );
  }

  for (let { id, ...customer } of _accepted) {
    let res = await PenPal.DataStore.update(
      "CoreAPI",
      "Customers",
      { _id: new Mongo.ObjectID(id) },
      { $set: customer }
    );

    if (res > 0) accepted.push({ id, ...customer });
  }

  return { accepted, rejected };
};

// -----------------------------------------------------------

export const upsertCustomers = async customers => {
  const result = [];
  const to_insert = [];
  const to_update = [];

  for (let customer of customers) {
    if (customer.id !== undefined) {
      to_update.push(customer);
    } else {
      to_insert.push(customer);
    }
  }

  const inserted = await insertProjects(to_insert);
  const updated = await updateProjects(to_update);

  return { inserted, updated };
};

// -----------------------------------------------------------

export const removeCustomer = async customer_id => {
  return await removeCustomers([customer_id]);
};

export const removeCustomers = async customer_ids => {
  let res = await PenPal.DataStore.delete("CoreAPI", "Customers", {
    _id: { $in: customer_ids.map(id => new Mongo.ObjectID(id)) }
  });

  if (res > 0) {
    return true;
  }

  return false;
};
