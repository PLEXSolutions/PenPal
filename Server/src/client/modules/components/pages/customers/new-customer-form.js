import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import cx from "classnames";

import { Components, registerComponent } from "../../../components.js";
import Hooks from "../../../hooks.js";
const { useIntrospection } = Hooks;

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
  const { loading, types } = useIntrospection();

  // ----------------------------------------------------

  const handleCustomerNameChange = event => setCustomerName(event.target.value);
  const handleCustomerIndustryChange = event =>
    setCustomerIndustry(event.target.value);
  const submitNewCustomer = () => null;

  // ----------------------------------------------------

  const industries = loading
    ? ["Loading industry values..."]
    : types.Industry.enumValues.map(value => value.name);

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
        label="Industry"
        className={classes.form_field}
      >
        {industries.map((item, index) => (
          <MenuItem key={index} value={index}>
            {item}
          </MenuItem>
        ))}
      </Components.StyledSelect>
      <Components.StyledButton
        disabled={customerName.length === 0 || customerIndustry === ""}
        color="primary"
        onClick={submitNewCustomer}
      >
        Submit
      </Components.StyledButton>
    </div>
  );
};

registerComponent("NewCustomerForm", NewCustomerForm);
