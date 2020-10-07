import PenPal from "meteor/penpal";

export default {
  trigger: {
    name: "CoreAPI.new.host",
    type: "host",
    trigger: "new"
  },
  node: {
    displayName: "(PenPal) New Host Trigger",
    name: "CoreAPINewHost",
    icon: "fa:desktop",
    description:
      "Webhook that will get called when a new host is added to PenPal",
    properties: []
  }
};
