export default {
  async getProject(root, { id }, { PenPalCachingAPI }) {
    return await PenPalCachingAPI.Projects.Get({ id });
  },
  async getProjects(root, args, { PenPalCachingAPI }) {
    return await PenPalCachingAPI.Projects.GetMany();
  }
};
