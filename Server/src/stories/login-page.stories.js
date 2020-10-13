import React, { useState } from "react";
import _ from "lodash";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";

const explore = storiesOf("UI/Login", module);

explore.add("Login", () => {
  return (
    <SetupProviders>
      <Components.Login />
    </SetupProviders>
  );
});
