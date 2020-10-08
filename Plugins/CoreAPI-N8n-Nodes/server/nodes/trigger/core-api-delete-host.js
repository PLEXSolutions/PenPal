import PenPal from "meteor/penpal";

export default {
  trigger: {
    name: "CoreAPI.delete.host",
    type: "host",
    trigger: "delete"
  },
  node: {
    displayName: "(PenPal) Delete Host Trigger",
    name: "CoreAPIDeleteHost",
    icon: "fa:desktop",
    description:
      "Webhook that will get called when a host is deleted in PenPal",
    properties: []
  }
};
