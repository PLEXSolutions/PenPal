import React from "react";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { useQuery } from "@apollo/react-hooks";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Components, registerComponent } from "../../components.js";
import Hooks from "../../hooks.js";
const { useAnalytics } = Hooks;

const Dashboard = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justify="center">
        Dashboard
      </Grid>
    </Container>
  );
};

registerComponent("Dashboard", Dashboard);
