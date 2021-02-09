import React from "react";
import path from "path";

import { registerStorybookMocks } from "meteor/penpal";
import mocks from "./mocks";
registerStorybookMocks("Server", mocks);

import { Components, StorybookMocks } from "meteor/penpal";

// Testable components
import { SnackbarProvider, useSnackbar } from "notistack";
import { MockedProvider } from "@apollo/client/testing";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
moment.locale("en");

export const SetupProviders = ({ children }) => (
  <SnackbarProvider maxSnacks={3}>
    <MockedProvider mocks={StorybookMocks} addTypename={false}>
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
