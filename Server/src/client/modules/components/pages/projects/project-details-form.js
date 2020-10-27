import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
  },
  submit_container: {
    marginTop: theme.spacing(4)
  },
  submit: {
    width: 300
  }
}));

const ProjectDetailsForm = ({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription
}) => {
  // ----------------------------------------------------

  const classes = useStyles();

  // ----------------------------------------------------

  const handleProjectNameChange = event => setProjectName(event.target.value);
  const handleProjectDescriptionChange = event =>
    setProjectDescription(event.target.value);

  return (
    <div className={classes.root}>
      <Components.StyledTextField
        label="Name"
        value={projectName}
        onChange={handleProjectNameChange}
        className={classes.form_field}
      />
      <Components.StyledTextField
        value={projectDescription}
        onChange={handleProjectDescriptionChange}
        label="Description"
        className={classes.form_field}
      />
    </div>
  );
};

registerComponent("ProjectDetailsForm", ProjectDetailsForm);
