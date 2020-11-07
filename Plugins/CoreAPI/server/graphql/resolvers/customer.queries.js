export default {
  async getCustomer(root, { id }, { PenPalCachingAPI }) {
    return PenPalCachingAPI.Customers.Get({ id });
  },
  async getCustomers(root, args, { PenPalCachingAPI }) {
    return PenPalCachingAPI.Customers.GetMany();
  }
};
