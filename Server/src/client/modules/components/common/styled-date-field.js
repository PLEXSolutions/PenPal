import React, { useState } from "react";
import { KeyboardDatePicker } from "@material-ui/pickers";

import { Components, registerComponent } from "../../components.js";

const StyledDateField = ({
  margin = "normal",
  variant = "inline",
  format = "MM/DD/yyyy",
  value,
  onChange,
  ...rest
}) => {
  return (
    <KeyboardDatePicker
      autoOk
      variant={variant}
      format={format}
      value={value}
      InputAdornmentProps={{ position: "start" }}
      onChange={onChange}
      TextFieldComponent={Components.StyledTextField}
      {...rest}
    />
  );
};

registerComponent("StyledDateField", StyledDateField);
