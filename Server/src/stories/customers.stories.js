import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";

const customers = storiesOf("UI/Customers", module);
/*customers.add("Main Page", () => (
  <SetupProviders>
    <Components.Projects />
  </SetupProviders>
));

customers.add("New Project Workflow", () => (
  <SetupProviders>
    <Components.NewProjectWorkflow open={true} handleClose={() => null} />
  </SetupProviders>
));*/

customers.add("New Customer Form", () => (
  <SetupProviders>
    <div style={{ width: 600, height: 400, border: "1px solid black" }}>
      <Components.NewCustomerForm />
    </div>
  </SetupProviders>
));
