import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import cx from "classnames";

import { Components, registerComponent } from "../../components.js";

const useStyles = makeStyles(theme => ({
  select: {
    minWidth: 200,
    background: "white",
    color: indigo[75],
    fontWeight: 200,
    border: "1px solid rgba(0, 0, 0, 0.87)",
    borderRadius: 12,
    borderColor: grey[400],
    paddingLeft: 24,
    paddingTop: 14,
    paddingBottom: 15,
    boxShadow: "0px 5px 8px -3px rgba(0,0,0,0.14)",
    "&:focus": {
      borderRadius: 12,
      background: "white",
      borderColor: indigo[100]
    }
  },
  icon: {
    color: indigo[300],
    right: 12,
    position: "absolute",
    userSelect: "none",
    pointerEvents: "none"
  },
  paper: {
    borderRadius: 12,
    marginTop: 8
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    background: "white",
    "& li": {
      fontWeight: 200,
      paddingTop: 12,
      paddingBottom: 12
    },
    "& li:hover": {
      background: indigo[100]
    },
    "& li.Mui-selected": {
      color: "white",
      background: indigo[400]
    },
    "& li.Mui-selected:hover": {
      background: indigo[500]
    }
  }
}));

const StyledSelect = ({
  value,
  onChange,
  children,
  placeholder = "",
  ...rest
}) => {
  const classes = useStyles();

  const iconComponent = props => {
    return <ExpandMoreIcon className={cx(props.className, classes.icon)} />;
  };

  const menuProps = {
    classes: {
      paper: classes.paper,
      list: classes.list
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    getContentAnchorEl: null
  };
  return (
    <FormControl>
      <Select
        disableUnderline
        classes={{ root: classes.select }}
        MenuProps={menuProps}
        IconComponent={iconComponent}
        displayEmpty
        value={value}
        onChange={onChange}
        {...rest}
      >
        {placeholder.length > 0 && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {children}
      </Select>
    </FormControl>
  );
};

registerComponent("StyledSelect", StyledSelect);
