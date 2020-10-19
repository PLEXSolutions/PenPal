import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

import { useQuery } from "@apollo/react-hooks";
import GetCustomersQuery from "./queries/get-customers.js";

import { Components, registerComponent } from "../../../components.js";

const useStyles = makeStyles({
  dialog: {
    height: "100%"
  },
  dialog_paper: {
    height: "70%",
    maxHeight: 600
  },
  stepper: {
    backgroundColor: "transparent",
    flexGrow: 1
  }
});

const steps = [
  {
    name: "Select Customer",
    component: Components.NewProjectWorkflowSelectCustomer
  },
  {
    name: "Create Project",
    component: () => null
  },
  {
    name: "Project Scope",
    component: () => null
  }
];

const NewProjectWorkflow = ({ open, handleClose }) => {
  // -------------------------------------------------------------

  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [nextEnabled, setNextEnabled] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const {
    loading: customersLoading,
    error: customersError,
    data: { getCustomers: currentCustomers } = {}
  } = useQuery(GetCustomersQuery, {
    pollInterval: 15000
  });

  // -------------------------------------------------------------

  const enableNextStep = () => setNextEnabled(true);
  const disableNextStep = () => setNextEnabled(false);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    disableNextStep();
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    enableNextStep();
  };

  // -------------------------------------------------------------

  const loading = customersLoading;
  const ActiveStep = steps[activeStep].component;

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      className={classes.dialog}
      classes={{ paper: classes.dialog_paper }}
    >
      <DialogTitle>{steps[activeStep].name}</DialogTitle>
      <Divider />
      <DialogContent>
        {loading ? (
          "Loading details..."
        ) : (
          <ActiveStep
            enableNext={enableNextStep}
            disableNext={disableNextStep}
            customers={currentCustomers}
          />
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <MobileStepper
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          className={classes.stepper}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </DialogActions>
    </Dialog>
  );
};

registerComponent("NewProjectWorkflow", NewProjectWorkflow);
