import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";

const projects = storiesOf("UI/Projects", module);
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
    <Components.NewProjectWorkflowSelectCustomer customers={[]} />
  </SetupProviders>
));
