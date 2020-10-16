import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

export async function upsertCustomers(args) {
  // TODO - Transactions?
  return {
    status: "Not yet implemented",
    was_success: false,
    affected_records: []
  };
}

export async function removeCustomers(args) {
  const response = {
    status: "Not yuet implemented",
    was_success: false,
    affected_records: []
  };

  return response;
}

export async function getCustomers(args) {
  let res = await PenPal.DataStore.fetch("CoreAPI", "Customers", {});
  return res;
}
