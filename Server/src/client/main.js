// Load all components
import "./modules/index.js";

// Import settings
import "./settings.js";

// Now render stuff
import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import { Components } from "./modules/components.js";

// Render the root component
Meteor.startup(() => {
  render(<Components.Root />, document.getElementById("app"));
});
