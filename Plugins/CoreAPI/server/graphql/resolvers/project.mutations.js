import PenPal from "meteor/penpal";

export default {
  async createProject(
    root,
    { project: { scope: { hosts = [], networks = [] } = {}, ...project } },
    context
  ) {
    const { accepted, rejected } = await PenPal.API.Projects.Insert(project);

    if (accepted.length > 0) {
      const project = accepted[0];

      // Now insert the hosts and networks with the appropriate project ID
      const { accepted: new_hosts } = await PenPal.API.Hosts.InsertMany(
        hosts.map(host_ip => ({ project: project.id, ip_address: host_ip }))
      );
      // NOTE: This will maybe cause a memory error if new_hosts has a length > 100,000 ish. Is this actually a problem?
      project.scope.hosts.push(...new_hosts.map(host => host.id));
      await PenPal.API.Projects.Update({
        id: project.id,
        "scope.hosts": project.scope.hosts
      });

      //await PenPal.API.Networks.insertMany(networks);

      return project;
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
