import React, { useState } from "react";

import { Components } from "meteor/penpal";
import { SetupProviders } from "stories/common.js";

export const ProjectView = () => (
  <SetupProviders>
    <Components.ProjectView project_id={1234} />
  </SetupProviders>
);

export default {
  title: "PenPal/CoreAPI"
};
