import PenPal from "meteor/penpal";
import _ from "lodash";

import { required_field } from "./common.js";

// -----------------------------------------------------------

export const getNetwork = async network_id => {
  return await PenPal.DataStore.fetchOne("CoreAPI", "Networks", {
    id: network_id
  });
};

export const getNetworks = async network_ids => {
  return await PenPal.DataStore.fetch("CoreAPI", "Networks", {
    id: { $in: network_ids }
  });
};

export const getNetworksByProject = async project_id => {
  const result = await PenPal.DataStore.fetch("CoreAPI", "Networks", {
    project: project_id
  });

  return result;
};

// -----------------------------------------------------------

export const insertNetwork = async network => {
  return await insertNetworks([network]);
};

export const insertNetworks = async networks => {
  const rejected = [];
  const _accepted = [];
  const accepted = [];

  for (let network of networks) {
    try {
      required_field(network, "project", "insertion");
      required_field(network, "subnet", "insertion");

      _accepted.push(network);
    } catch (e) {
      rejected.push({ network, error: e });
    }
  }

  if (_accepted.length > 0) {
    let result = await PenPal.DataStore.insertMany(
      "CoreAPI",
      "Networks",
      _accepted
    );
    accepted.push(...result);
  }

  return { accepted, rejected };
};

// -----------------------------------------------------------

export const updateNetwork = async network => {
  return await updateNetworks([network]);
};

export const updateNetworks = async networks => {
  const rejected = [];
  const _accepted = [];
  const accepted = [];

  for (let network of networks) {
    try {
      required_field(network, "id", "update");
      _accepted.push(network);
    } catch (e) {
      rejected.push({ network, error: e });
    }
  }

  let matched_networks = await PenPal.DataStore.fetch("CoreAPI", "Networks", {
    id: { $in: _accepted.map(network => network.id) }
  });

  if (matched_networks.length !== _accepted.length) {
    // Find the unknown IDs
    console.error('Implement updateNetworks "network not found" functionality');
  }

  for (let { id, ...network } of _accepted) {
    // TODO: Needs some work, but I'd prefer to update the datastore layer than here
    let res = await PenPal.DataStore.update(
      "CoreAPI",
      "Networks",
      { id },
      { $set: network }
    );

    if (res > 0) accepted.push({ id, ...network });
  }

  return { accepted, rejected };
};

// -----------------------------------------------------------

export const removeNetwork = async network_id => {
  return await removeNetworks([network_id]);
};

export const removeNetworks = async network_ids => {
  // Get all the network data for hooks so the deleted network hook has some info for notifications and such
  let networks = await PenPal.DataStore.fetch("CoreAPI", "Networks", {
    id: { $in: network_ids }
  });

  let res = await PenPal.DataStore.delete("CoreAPI", "Networks", {
    id: { $in: network_ids }
  });

  if (res > 0) {
    return true;
  }

  return false;
};
