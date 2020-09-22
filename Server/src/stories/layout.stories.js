import React from "react";
import { storiesOf } from "@storybook/react";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";

// Layout
/* --------------------------------------------- */
const layout = storiesOf("UI/Layout", module);
layout.add("Default", () => (
  <SetupProviders>
    <Components.Layout>
      No subpages will render in the storybook
    </Components.Layout>
  </SetupProviders>
));
