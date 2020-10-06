export default {
  mockHosts() {
    return [
      {
        id: "test-host-2",
        project: "test-project",
        ipv4: "127.0.0.1",
        mac: "00:11:22:33:44:55",
        hostnames: ["localhost", "test-hostname-1"],
        os: "Windows 10"
      },
      {
        id: "test-host-2",
        project: "test-project",
        ipv4: "127.0.0.2",
        mac: "00:11:22:33:44:66",
        hostnames: ["localhost", "test-hostname-2"],
        os: "Linux"
      }
    ];
  }
};
