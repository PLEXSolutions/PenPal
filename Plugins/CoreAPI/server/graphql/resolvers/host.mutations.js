import PenPal from "meteor/penpal";

export default {
  async createHost(root, { projectID, host }, context) {
    const { accepted, rejected } = await PenPal.API.Hosts.Insert(projectID, host);

    if (accepted.length > 0) {
      return accepted[0];
    } else {
      throw rejected[0].error;
    }
  },

  async createHosts(root, { projectID, hosts }, context) {
    const { accepted, rejected } = await PenPal.API.Hosts.Insert(projectID, hosts);

    if (accepted.length > 0) {
      return accepted;
    } else {
      throw rejected[0].error;
    }
  },

  async updateHost(root, { host }, context) {
    const { accepted, rejected } = await PenPal.API.Hosts.Update(host);

    if (accepted.length > 0) {
      return accepted[0];
    } else {
      throw rejected[0].error;
    }
  },

  async removeHost(root, { id }, context) {
    return await PenPal.API.Customers.Remove(id);
  }
};
