// Import settings
import "./settings.js";

// Now render stuff
import { Meteor } from "meteor/meteor";
import PenPal, { Components } from "meteor/penpal";
import React from "react";
import { render } from "react-dom";

// Render the root component
Meteor.startup(async () => {
  await PenPal.loadPlugins();
  render(<Components.Root />, document.getElementById("app"));
});
