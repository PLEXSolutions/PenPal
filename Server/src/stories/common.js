import React from "react";

// Now import to appropriately add all correct components
import "../client/modules/components/index.js";
import { Components } from "../client/modules/components.js";

// Testable components
import { SnackbarProvider, useSnackbar } from "notistack";
import { MockedProvider } from "@apollo/react-testing";

export const SetupProviders = ({ children }) => (
  <SnackbarProvider maxSnacks={3}>
    <MockedProvider mocks={[]}>{children}</MockedProvider>
  </SnackbarProvider>
);
