export default {
  async checkN8nWebhook(root, { id }, context) {
    console.log("Checking for n8n webhook", id);
    return {
      id
    };
  }
};
