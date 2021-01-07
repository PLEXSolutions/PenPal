import React, { useState } from "react";
import _ from "lodash";
import cx from "classnames";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";

import { useSnackbar } from "notistack";
import { useMutation } from "@apollo/client";

import { Components, registerComponent } from "../../../components.js";
import CreateProjectMutation from "./mutations/create-project.js";
import GetProjectSummaries from "./queries/get-project-summaries.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%"
  },
  top_pane: {
    flex: 1,
    width: "70%",
    maxWidth: 700,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2)
  },
  bottom_pane: {
    width: "70%",
    maxWidth: 700,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: theme.spacing(2)
  },
  table: {
    width: "100%"
  }
}));

const ReviewTableRow = ({ title, data }) => (
  <TableRow>
    <TableCell component="th" scope="row">
      {title}
    </TableCell>
    <TableCell style={{ width: 160 }} align="right">
      {data}
    </TableCell>
  </TableRow>
);

const ProjectReviewForm = ({
  customers,
  selectedCustomer,
  projectName,
  projectDescription,
  projectStartDate,
  projectEndDate,
  projectIPs,
  projectNetworks,
  handleClose = () => null
}) => {
  // ----------------------------------------------------

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [createProject] = useMutation(CreateProjectMutation, {
    // TODO: Ideally we will update the cache directly instead of using the refetch queies, but this
    // is complicated because the variables are not currently present in a parent of this component.
    // I will need to re-arrange some logic for this to work.
    refetchQueries: ["getProjectSummaries"]

    /*update(cache, { data: { createProject: new_project } }) {
      const current = cache.readQuery({ query: GetProjectSummaries })
        ?.getProjects ?? { projects: [], totalCount: 0 };
      const data = {
        getProjects: {
          projects: [...current.projects, new_project],
          totalCount: current.totalCount + 1
        }
      };
      console.log(`Modified cache: ${JSON.stringify(data, null, 4)}`);
      cache.writeQuery({
        query: GetProjectSummaries,
        data
      });
    }*/
  });

  // ----------------------------------------------------

  const handleCreateProject = async () => {
    const variables = _.pickBy({
      customer: customers[selectedCustomer].id,
      name: projectName,
      description: projectDescription,
      start_date: projectStartDate,
      end_date: projectEndDate,
      project_ips: projectIPs,
      project_networks: projectNetworks
    });

    try {
      const result = await createProject({
        variables
      });

      handleClose();
    } catch (e) {
      console.error(e);
      enqueueSnackbar(e.message, { variant: "error", autoHideDuration: 10000 });
    }
  };

  // ----------------------------------------------------

  return (
    <div className={classes.root}>
      <div className={classes.top_pane}>
        <Table className={classes.table}>
          <TableBody>
            <ReviewTableRow
              title={"Customer"}
              data={customers[selectedCustomer].name}
            />
            <ReviewTableRow title={"Project Name"} data={projectName} />
            <ReviewTableRow
              title={"Project Description"}
              data={projectDescription}
            />
            <ReviewTableRow
              title={"Start Date"}
              data={
                projectStartDate === null
                  ? "None"
                  : projectStartDate.format("MM/DD/yyyy")
              }
            />
            <ReviewTableRow
              title={"End Date"}
              data={
                projectEndDate === null
                  ? "None"
                  : projectEndDate.format("MM/DD/yyyy")
              }
            />
            <ReviewTableRow title={"# Hosts"} data={projectIPs.length} />
            <ReviewTableRow
              title={"# Networks"}
              data={projectNetworks.length}
            />
          </TableBody>
        </Table>
      </div>
      <div className={classes.bottom_pane}>
        <Components.StyledButton color="primary" onClick={handleCreateProject}>
          Create Project
        </Components.StyledButton>
      </div>
    </div>
  );
};

registerComponent("NewProjectWorkflowReview", ProjectReviewForm);
