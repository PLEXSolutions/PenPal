import React from "react";

// Now import to appropriately add all correct components
import "../client/modules/components/index.js";
import { Components } from "../client/modules/components.js";

// Testable components
import { SnackbarProvider, useSnackbar } from "notistack";
import { MockedProvider } from "@apollo/client/testing";
import mocks from "./mocks";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
moment.locale("en");

export const SetupProviders = ({ children }) => (
  <SnackbarProvider maxSnacks={3}>
    <MockedProvider mocks={mocks} addTypename={false}>
      <MuiPickersUtilsProvider
        libInstance={moment}
        utils={MomentUtils}
        locale="en"
      >
        <Components.IntrospectionProvider>
          {children}
        </Components.IntrospectionProvider>
      </MuiPickersUtilsProvider>
    </MockedProvider>
  </SnackbarProvider>
);
