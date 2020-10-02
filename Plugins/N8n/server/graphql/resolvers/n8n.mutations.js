export default {
  async createN8nWebhook(root, { id, url }, context) {
    console.log("[.] Creating webhook", id, url);

    return {
      id,
      url
    };
  },

  async deleteN8nWebhook(root, { id }, context) {
    console.log("Deleting webhook", id);
    return true;
  }
};
