import PenPal from "meteor/penpal";

export default {
  async createProject(root, { project }, context) {
    const { accepted, rejected } = await PenPal.API.Projects.Insert(project);

    if (accepted.length > 0) {
      return accepted[0];
    } else {
      throw rejected[0].error;
    }
  },

  async updateProject(root, { project }, context) {
    const { accepted, rejected } = await PenPal.API.Projects.Update(project);

    if (accepted.length > 0) {
      return accepted[0];
    } else {
      throw rejected[0].error;
    }
  },

  async removeProject(root, { id }, context) {
    return await PenPal.API.Projects.Remove(id);
  }
};
