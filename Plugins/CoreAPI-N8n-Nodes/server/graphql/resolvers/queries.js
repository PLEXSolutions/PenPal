import PenPal from "meteor/penpal";

export default {
  async coreAPIGetHostData(root, { data }, context) {
    return await PenPal.API.Hosts.GetMany(data.host_ids);
  }
};
