import React, { useState } from "react";
import _ from "lodash";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Components } from "../client/modules/components.js";
import { SetupProviders } from "./common.js";
import TreeView from "@material-ui/lab/TreeView";

const explore = storiesOf("UI/Admin", module);

explore.add("Panel", () => {
  const [visible, setVisible] = useState(true);

  return (
    <SetupProviders>
      <Components.AdminPanel visible={visible} />
    </SetupProviders>
  );
});

explore.add("Account Management", () => {
  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setVisible(true), 1500);
  };

  return (
    <SetupProviders>
      <Components.AdminAccountManagement
        open={visible}
        handleClose={handleClose}
      />
    </SetupProviders>
  );
});

const users = [
  {
    id: "ECbJtF38QJsnzk2uZ",
    createdAt: "2020-08-04T11:32:00.099Z",
    emails: ["josh"],
    settings: {
      enabled: true,
      roles: ["_role_admin", "_role_read_write"]
    }
  }
];
explore.add("Account Display Lines", () => {
  return (
    <SetupProviders>
      <div style={{ width: "50%" }}>
        <Components.AdminAccountManagementAccountLines users={users} />
      </div>
    </SetupProviders>
  );
});

explore.add("Automated Task Management", () => {
  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setVisible(true), 1500);
  };

  return (
    <SetupProviders>
      <Components.AdminAutomatedTaskManagement
        open={visible}
        handleClose={handleClose}
      />
    </SetupProviders>
  );
});
