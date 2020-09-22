import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Grid from "@material-ui/core/Grid";

import { Components } from "../client/modules/components.js";

const icons = storiesOf("UI/Icons", module);

const os_list = [
  "Debian 10",
  "Generic Linux",
  "Windows 7",
  "Windows 10",
  "Mac OSX",
  "Centos 7",
  "Ubuntu 20.04",
  "Fedora 30",
  "RHEL 6"
];

icons.add("System Icons", () => {
  return (
    <Grid container spacing={4}>
      {os_list.map(os => (
        <Grid item key={os}>
          <center>
            {os}: <br /> <Components.AutoOSIcon os_name={os} />
          </center>
        </Grid>
      ))}
    </Grid>
  );
});
