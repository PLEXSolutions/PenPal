import React from "react";
import _ from "lodash";

import Grid from "@material-ui/core/Grid";

import { Components, registerComponent } from "../../components.js";

const Configuration = () => {
  return <Components.ConfigurationSelector />;
};

registerComponent("Configuration", Configuration);
