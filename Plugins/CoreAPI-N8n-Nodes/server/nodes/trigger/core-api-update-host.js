import PenPal from "meteor/penpal";

export default {
  trigger: {
    name: "CoreAPI.update.host",
    type: "host",
    trigger: "update"
  },
  node: {
    displayName: "(PenPal) Update Host Trigger",
    name: "CoreAPIUpdateHost",
    icon: "fa:desktop",
    description:
      "Webhook that will get called when a host is updated in PenPal",
    properties: []
  }
};
