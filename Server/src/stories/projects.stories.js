import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";

const projects = storiesOf("PenPal/Projects", module);
projects.add("Main Page", () => (
  <SetupProviders>
    <Components.Projects />
  </SetupProviders>
));

projects.add("New Project Workflow", () => (
  <SetupProviders>
    <Components.NewProjectWorkflow open={true} handleClose={() => null} />
  </SetupProviders>
));

projects.add("New Project Workflow (Select Customer)", () => (
  <SetupProviders>
    <div style={{ width: 600, height: 400, border: "1px solid black" }}>
      <Components.NewProjectWorkflowSelectCustomer customers={[]} />
    </div>
  </SetupProviders>
));
