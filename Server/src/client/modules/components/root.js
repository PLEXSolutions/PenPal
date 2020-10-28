import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
moment.locale("en");

import apolloInit from "./apollo-init.js";
import { Components, registerComponent } from "../components.js";

const removeLoadingDiv = () => {
  document.getElementById("loading").remove();
};

const Root = () => {
  const [apolloClient, setApolloClient] = useState(new ApolloClient());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setApolloClient(await apolloInit());
      setLoading(false);
      removeLoadingDiv();
    })();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          {loading ? null : (
            <MuiPickersUtilsProvider
              libInstance={moment}
              utils={MomentUtils}
              locale="en"
            >
              <Components.ErrorBoundary>
                <Components.IntrospectionProvider>
                  <Components.AccountProvider>
                    <Components.ForceLogin>
                      <Components.Layout />
                    </Components.ForceLogin>
                  </Components.AccountProvider>
                </Components.IntrospectionProvider>
              </Components.ErrorBoundary>
            </MuiPickersUtilsProvider>
          )}
        </BrowserRouter>
      </SnackbarProvider>
    </ApolloProvider>
  );
};

registerComponent("Root", Root);
