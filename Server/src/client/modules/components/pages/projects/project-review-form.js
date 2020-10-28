import React, { useState } from "react";
import _ from "lodash";
import cx from "classnames";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";
import { useMutation } from "@apollo/react-hooks";

import Divider from "@material-ui/core/Divider";

import { Components, registerComponent } from "../../../components.js";
import CreateProjectMutation from './mutations/create-project.js';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100%",
    width: "100%"
  },
  top_pane: {
    flex: 1,
    width: "100%"
  },
  bottom_pane: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%"
  }
}));

const ProjectReviewForm = ({
  selectedCustomer,
  projectName,
  projectDescription,
  projectStartDate,
  projectEndDate,
  projectIPs,
  projectNetworks
}) => {
  // ----------------------------------------------------

  const classes = useStyles();
  const [createProject] = useMutation(CreateProjectMutation);

  // ----------------------------------------------------

  return (
    <div className={classes.root}>
      <div className={classes.top_pane}></div>
      <div className={classes.bottom_pane}>
        <Components.StyledButton color="primary" onClick={}>
          Create Project
        </Components.StyledButton>
      </div>
    </div>
  );
};

registerComponent("NewProjectWorkflowReview", ProjectReviewForm);
