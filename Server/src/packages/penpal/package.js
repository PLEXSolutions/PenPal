Package.describe({
  name: "penpal",
  version: "0.1.0"
});

Package.onUse(function(api) {
  api.use("ecmascript");
  api.mainModule("penpal-client.js", "client");
  api.mainModule("penpal-server.js", "server");
});
