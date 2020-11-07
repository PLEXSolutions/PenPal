export default {
  async createProject(
    root,
    { project: { scope: { hosts = [], networks = [] } = {}, ...project } },
    { PenPalCachingAPI }
  ) {
    const { accepted, rejected } = await PenPalCachingAPI.Projects.Insert(
      project
    );

    if (accepted.length > 0) {
      // We need to get the project so we can update it
      const project = await PenPalCachingAPI.Projects.Get(accepted[0].id);

      // Now insert the hosts and networks with the appropriate project ID
      const { accepted: new_hosts } = await PenPalCachingAPI.Hosts.InsertMany(
        hosts.map(host_ip => ({ project: project.id, ip_address: host_ip }))
      );

      // NOTE: This will maybe cause a memory error if new_hosts has a length > 100,000 ish. Is this actually a problem?
      project.scope.hosts.push(...new_hosts.map(host => host.id));

      await PenPalCachingAPI.Projects.Update({
        id: project.id,
        "scope.hosts": project.scope.hosts
      });

      //await PenPalCachingAPI.Networks.InsertMany(networks);

      return project;
    } else {
      throw rejected[0].error;
    }
  },

  async updateProject(root, { project }, { PenPalCachingAPI }) {
    const { accepted, rejected } = await PenPalCachingAPI.Projects.Update(
      project
    );

    if (accepted.length > 0) {
      return accepted[0];
    } else {
      throw rejected[0].error;
    }
  },

  async removeProject(root, { id }, { PenPalCachingAPI }) {
    return await PenPalCachingAPI.Projects.Remove(id);
  }
};
