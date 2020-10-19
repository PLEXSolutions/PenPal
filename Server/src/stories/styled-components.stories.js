import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";

const projects = storiesOf("UI/Styled Components", module);

projects.add("Text Field", () => (
  <SetupProviders>
    <Components.StyledTextField
      label={"Primary field"}
      placeholder={"Placeholder"}
      helperText={"Helper Text"}
      margin={"normal"}
    />
  </SetupProviders>
));

// ------------------------------------------------------

import MenuItem from "@material-ui/core/MenuItem";
const items = [
  { id: "test-1", value: "test 1" },
  { id: "test-2", value: "test 2" }
];

projects.add("Select", () => {
  const [selected, setSelected] = useState("");
  const handleChange = event => setSelected(event.target.value);

  return (
    <SetupProviders>
      <Components.StyledSelect value={selected} onChange={handleChange}>
        {items.map((item, index) => (
          <MenuItem key={item.id} value={index}>
            {item.value}
          </MenuItem>
        ))}
      </Components.StyledSelect>
    </SetupProviders>
  );
});
