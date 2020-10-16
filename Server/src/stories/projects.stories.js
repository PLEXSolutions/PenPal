import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SnackbarProvider, useSnackbar } from "notistack";

const SetupPage = ({ children }) => (
  <div
    style={{ width: "100%", height: "100%", padding: 4, background: "#DDD" }}
  >
    <SnackbarProvider maxSnacks={3}>{children}</SnackbarProvider>
  </div>
);

const projects = storiesOf("UI/Projects", module);
projects.add("Main Page", () => (
  <SetupPage>
    <Components.Projects />
  </SetupPage>
));
projects.add("New Project Workflow", () => (
  <SetupPage>
    <Components.NewProjectWorkflow open={true} handleClose={() => null} />
  </SetupPage>
));
