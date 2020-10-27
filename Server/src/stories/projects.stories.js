import React, { useState } from "react";
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
    <div style={{ width: 1000, height: 600, border: "1px solid black" }}>
      <Components.NewProjectWorkflowSelectCustomer customers={[]} />
    </div>
  </SetupProviders>
));

projects.add("New Project Workflow (Project Details/Scope)", () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectIPs, setProjectIPs] = useState([]);
  const [projectNetworks, setProjectNetworks] = useState([]);

  return (
    <SetupProviders>
      <div style={{ width: 1000, height: 600, border: "1px solid black" }}>
        <Components.NewProjectWorkflowProjectDetails
          projectName={projectName}
          setProjectName={setProjectName}
          projectDescription={projectDescription}
          setProjectDescription={setProjectDescription}
          projectIPs={projectIPs}
          setProjectIPs={setProjectIPs}
          projectNetworks={projectNetworks}
          setProjectNetworks={setProjectNetworks}
        />
      </div>
    </SetupProviders>
  );
});
