import React, { useState } from "react";
import { Components, registerComponent } from "meteor/penpal";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const tabs = [
  {
    title: "Dashboard",
    content: Components.ProjectViewDashboard
  },
  {
    title: "Hosts",
    content: () => "Hosts"
  },
  {
    title: "Networks",
    content: () => "Networks"
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    background: "transparent"
  },
  tab_bar: {
    paddingLeft: 4,
    paddingRight: 4
  },
  tab_panel: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}));

const TabPanel = (props) => {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      className={classes.tab_panel}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
};

const ProjectViewDataContainer = ({ project }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.tab_bar}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map(({ title }, i) => (
            <Tab key={i} label={title} />
          ))}
        </Tabs>
      </Paper>
      {tabs.map(({ content: Content }, i) => (
        <TabPanel value={value} index={i}>
          <Content project={project} />
        </TabPanel>
      ))}
    </div>
  );
};

registerComponent("ProjectViewDataContainer", ProjectViewDataContainer);
