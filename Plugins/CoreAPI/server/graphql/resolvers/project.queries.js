import PenPal from "meteor/penpal";

export default {
  async getProject(root, { id }, context) {
    return PenPal.API.Projects.Get({ id });
  },
  async getProjects(root, args, context) {
    return PenPal.API.Projects.GetMany();
  }
};
