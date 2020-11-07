export default {
  async getProject(root, { id }, { PenPalCachingAPI }) {
    return PenPalCachingAPI.Projects.Get({ id });
  },
  async getProjects(root, args, { PenPalCachingAPI }) {
    return PenPalCachingAPI.Projects.GetMany();
  }
};
