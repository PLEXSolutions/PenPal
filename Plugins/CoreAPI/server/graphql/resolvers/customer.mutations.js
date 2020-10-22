import PenPal from "meteor/penpal";

export default {
  async createCustomer(root, { customer }, context) {
    const { accepted, rejected } = await PenPal.API.Customers.Insert(customer);

    if (accepted.length > 0) {
      return accepted[0];
    } else {
      throw rejected[0].error;
    }
  },

  async updateCustomer(root, { customer }, context) {
    const { accepted, rejected } = await PenPal.API.Customers.Update(customer);

    if (accepted.length > 0) {
      return accepted[0];
    } else {
      throw rejected[0].error;
    }
  },

  async removeCustomer(root, { id }, context) {
    return await PenPal.API.Customers.Remove(id);
  }
};
