import React from "react";

import { Components } from "meteor/penpal";

const SetupPage = ({ children }) => (
  <div
    style={{ width: "100%", height: "100%", padding: 4, background: "#DDD" }}
  >
    {children}{" "}
  </div>
);

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

export const TrendingStatistic = () => (
  <SetupPage>
    <Container>
      <Grid container spacing={3}>
        <Grid item lg={4} sm={6} xl={4} xs={12}>
          <Components.DashboardTrendingStatistic
            title="Total Projects"
            value={9001}
            delta={36}
            icon={<AccountTreeIcon />}
            caption={`since 2 seconds ago`}
          />
        </Grid>
        <Grid item lg={4} sm={6} xl={4} xs={12}>
          <Components.DashboardTrendingStatistic
            title="Total Hosts"
            value={200}
            delta={-72}
            icon={<DesktopWindowsIcon />}
            caption={`since last year`}
          />
        </Grid>
      </Grid>
    </Container>
  </SetupPage>
);

export default {
  title: "PenPal/Base/Dashboard"
};
