import React, { useState } from "react";
import _ from "lodash";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import { Components, registerComponent } from "../../../components.js";

const useStyles = makeStyles(theme => ({
  main: {
    padding: theme.spacing(1)
  },
  label: {
    textTransform: "capitalize"
  }
}));

const transform_key = key => key.replace("_", " ");

const ConfigurationPageSection = ({
  handleConfigChange,
  path,
  config: { __typename, ...rest },
  depth = 0
}) => {
  const classes = useStyles();
  const keys = Object.keys(rest);
  const changeHandlers = _.chain(keys)
    .map(key => {
      return {
        key,
        handler: event => {
          handleConfigChange(`${path}.${key}`, event.target.value);
        }
      };
    })
    .keyBy("key")
    .value();

  return _.map(keys, key => {
    const key_path = `${path}.${key}`;
    switch (typeof rest[key]) {
      case "string":
        return (
          <TextField
            InputLabelProps={{ className: classes.label }}
            label={transform_key(key)}
            value={rest[key]}
            onChange={changeHandlers[key].handler}
            key={key_path}
          ></TextField>
        );
      case "boolean":
        return <p key={key_path}>{`${key}: Checkbox`}</p>;
      case "number":
        return <p key={key_path}>{`${key}: Number input`}</p>;
      case "object":
        return (
          <ConfigurationPageSection
            key={key_path}
            handleConfigChange={handleConfigChange}
            path={key_path}
            depth={depth + 1}
            config={rest[key]}
          />
        );
      default:
        return <p>'Unknown'</p>;
    }
  });
};

const ConfigurationPage = ({ localConfig, handleConfigChange }) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(
    Object.keys(localConfig)?.[0] ?? ""
  );
  const handleChange = (event, newValue) => setSelectedTab(newValue);
  const config_items = Object.keys(localConfig);

  return (
    <>
      <AppBar position="static" color="default">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {config_items.map(item => (
            <Tab
              key={item}
              disabled={localConfig[item] === null}
              value={item}
              label={item.replace("_", " ")}
            />
          ))}
        </Tabs>
      </AppBar>

      {config_items.map(item => (
        <div key={item} hidden={selectedTab !== item} className={classes.main}>
          {selectedTab === item && (
            <ConfigurationPageSection
              handleConfigChange={handleConfigChange}
              path={item}
              config={localConfig[item]}
            />
          )}
        </div>
      ))}
    </>
  );
};

registerComponent("ConfigurationPage", ConfigurationPage);
