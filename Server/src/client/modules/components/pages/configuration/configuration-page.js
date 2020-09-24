import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

import { Components, registerComponent } from "../../../components.js";
import { generateGqlFromSchema } from "../../../graphql-helpers.js";
import Hooks from "../../../hooks.js";
const { useImperativeQuery } = Hooks;

const useStyles = makeStyles(theme => ({
  main: {
    padding: theme.spacing(1)
  }
}));

const ConfigurationPageTab = ({
  types,
  queries,
  mutations,
  plugin,
  config: { __typename, ...rest } = {}
}) => {
  return <pre>{JSON.stringify(rest, null, 4)}</pre>;
};

const ConfigurationPage = ({
  types,
  queries,
  mutations,
  plugin: {
    settings: { configuration }
  }
}) => {
  const classes = useStyles();
  const query = generateGqlFromSchema(
    types,
    configuration.schema_root,
    configuration.getter
  );

  console.log(mutations);

  const getConfig = useImperativeQuery(query);
  const [localConfig, setLocalConfig] = useState({});
  const [selectedTab, setSelectedTab] = useState("");

  const handleChange = (event, newValue) => setSelectedTab(newValue);

  useEffect(() => {
    (async () => {
      const config =
        (await getConfig())?.data?.getBurpsuiteProConfiguration ?? {};
      delete config.__typename;
      setLocalConfig(config);
      const tab_names = Object.keys(config);
      setSelectedTab(tab_names.length > 0 ? tab_names[0] : "");
    })();
  }, []);

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
            <ConfigurationPageTab
              types={types}
              queries={queries}
              mutations={mutations}
              setter={configuration.setter}
              config={localConfig[item]}
            />
          )}
        </div>
      ))}
    </>
  );
};

registerComponent("ConfigurationPage", ConfigurationPage);
