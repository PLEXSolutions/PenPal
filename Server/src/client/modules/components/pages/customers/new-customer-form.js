import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import cx from "classnames";

import { Components, registerComponent } from "../../../components.js";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100%",
    width: "100%"
  },
  form_field: {
    marginBottom: theme.spacing(2)
  }
}));

const industries = [{ id: "test-1", value: "Agriculture" }];

const NewCustomerForm = () => {
  // ----------------------------------------------------

  const classes = useStyles();
  const [customerName, setCustomerName] = useState("");
  const [customerIndustry, setCustomerIndustry] = useState("");

  // ----------------------------------------------------

  const handleCustomerNameChange = (event, value) => setCustomerName(value);
  const handleCustomerIndustryChange = event =>
    setCustomerIndustry(event.target.value);

  // ----------------------------------------------------

  return (
    <div className={classes.root}>
      <Components.StyledTextField
        label={"Name"}
        value={customerName}
        onChange={handleCustomerNameChange}
        className={classes.form_field}
      />
      <Components.StyledSelect
        value={customerIndustry}
        onChange={handleCustomerIndustryChange}
        label={"Industry"}
        placeholder="Industry"
      >
        {industries.map((item, index) => (
          <MenuItem key={item.id} value={index}>
            {item.value}
          </MenuItem>
        ))}
      </Components.StyledSelect>
    </div>
  );
};

registerComponent("NewCustomerForm", NewCustomerForm);
