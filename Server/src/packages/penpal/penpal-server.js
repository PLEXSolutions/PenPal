import { check, Match } from "meteor/check";
import _ from "lodash";
import { mergeTypeDefs } from "@graphql-tools/merge";

// ----------------------------------------------------------------------------

const check_manifest = ({ name, version, dependsOn }) => {
  let manifest_accept = true;

  const try_check = (value, type, repr_value, repr_type) => {
    try {
      check(value, type);
    } catch (e) {
      console.log(`Manifest.${repr_value} must be of type ${repr_type}`);
      manifest_accept = false;
    }
  };

  try_check(name, String, "name", "String");
  try_check(version, String, "version", "String");
  try_check(dependsOn, [String], "dependsOn", "[String]");

  return manifest_accept;
};

// ----------------------------------------------------------------------------

const isFunction = (obj) => !!(obj && obj.constructor && obj.call && obj.apply);
const check_plugin = (plugin) => {
  let plugin_accept = true;

  const try_check = (value, type, repr_value, repr_type) => {
    try {
      check(value, type);
    } catch (e) {
      console.log(`Plugin.${repr_value} must be of type ${repr_type}`);
      plugin_accept = false;
    }
  };

  try_check(
    plugin.loadPlugin,
    Match.Where(isFunction),
    "loadPlugin",
    "Function"
  );

  return plugin_accept;
};

// ----------------------------------------------------------------------------

const check_n8n = (n8n) => {
  let n8n_accept = true;

  const try_check = (value, type, repr_value, repr_type) => {
    try {
      check(value, type);
    } catch (e) {
      console.log(`settings.n8n.${repr_value} must be of type ${repr_type}`);
      n8n_accept = false;
    }
  };

  if (n8n.workflow_nodes !== undefined) {
    if (!Array.isArray(n8n.workflow_nodes)) {
      console.log(`settings.n8n.workflow_nodes must be of type Array`);
    } else {
      for (let i = 0; i < n8n.workflow_nodes.length; i++) {
        const node = n8n.workflow_nodes[i];
        try_check(
          node.displayName,
          String,
          `workflow_nodes.${i}.displayName`,
          "String"
        );
        try_check(node.name, String, `workflow_nodes.${i}.name`, "String");
        try_check(node.icon, String, `workflow_nodes.${i}.icon`, "String");
        try_check(
          node.description,
          String,
          `workflow_nodes.${i}.description`,
          "String"
        );
        try_check(
          node.properties,
          Match.Where(Array.isArray),
          `workflow_nodes.${i}.properties`,
          "Array"
        );
      }
    }
  }

  if (n8n.trigger_nodes !== undefined) {
    if (!Array.isArray(n8n.trigger_nodes)) {
      console.log(`settings.n8n.trigger_nodes must be of type Array`);
    } else {
      for (let i = 0; i < n8n.trigger_nodes.length; i++) {
        const node = n8n.trigger_nodes[i];
        try_check(
          node.displayName,
          String,
          `trigger_nodes.${i}.displayName`,
          "String"
        );
        try_check(node.name, String, `trigger_nodes.${i}.name`, "String");
        try_check(node.icon, String, `trigger_nodes.${i}.icon`, "String");
        try_check(
          node.description,
          String,
          `trigger_nodes.${i}.description`,
          "String"
        );
        try_check(
          node.properties,
          Match.Where(Array.isArray),
          `trigger_nodes.${i}.properties`,
          "Array"
        );
      }
    }
  }

  return n8n_accept;
};

// ----------------------------------------------------------------------------
const build_docker = async (docker) => {
  if (docker) {
    await PenPal.API.Docker.Build(docker);
  }
};
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

const PenPal = {};
PenPal.RegisteredPlugins = {};
PenPal.LoadedPlugins = {};

// ----------------------------------------------------------------------------

PenPal.registerPlugin = (manifest, plugin) => {
  if (!check_manifest(manifest) || !check_plugin(plugin)) {
    console.error(
      `[!] Failed to register plugin: ${manifest?.name}@${manifest?.version}`
    );
    return;
  }

  const { name, version, dependsOn } = manifest;
  const name_version = `${name}@${version}`;
  console.log(`[+] Registered plugin: ${name_version}`);

  PenPal.RegisteredPlugins[name_version] = {
    dependsOn,
    name,
    version,
    plugin,
  };
};

// ----------------------------------------------------------------------------

PenPal.loadPlugins = () => {
  PenPal.LoadedPlugins = _.mapValues(PenPal.RegisteredPlugins, (plugin) => ({
    loaded: false,
    name: plugin.name,
    version: plugin.version,
  }));

  let plugins_types = {};
  let plugins_resolvers = [{ Query: {} }, { Mutation: {} }];
  let plugins_loaders = {};
  let plugins_n8n_configs = {};

  const plugins_to_load = Object.keys(PenPal.RegisteredPlugins);
  while (plugins_to_load.length > 0) {
    const plugin_name = plugins_to_load.shift();
    console.log(`[.] Loading ${plugin_name}`);
    const { dependsOn, plugin } = PenPal.RegisteredPlugins[plugin_name];

    // Ensure that all prerequisites are available.  If not, it's impossible to load
    const all_prereqs_available = _.reduce(
      dependsOn,
      (result, prereq) =>
        result && PenPal.RegisteredPlugins[prereq] !== undefined,
      true
    );
    if (!all_prereqs_available) {
      console.error(
        `[!] Failed to load ${plugin_name}. Not all dependencies met.`
      );
      delete PenPal.RegisteredPlugins[plugin_name];
      continue;
    }

    // Check to see if all prerequisites loaded. If not, to the back of the queue.
    const all_prereqs_loaded = _.reduce(
      dependsOn,
      (result, prereq) => result && PenPal.LoadedPlugins[prereq].loaded,
      true
    );
    if (!all_prereqs_loaded) {
      plugins_to_load.push(plugin_name);
      continue;
    }

    // Now merge the types from this plugin into the schema
    const { types, resolvers, loaders, settings } = plugin.loadPlugin();

    if (settings.n8n !== undefined) {
      if (!check_n8n(settings.n8n)) {
        console.error(
          `[!] Failed to load ${plugin_name}. N8n config is improper`
        );
        delete PenPal.RegisteredPlugins[plugin_name];
        continue;
      }
    }

    // Now check and build Dockerfile if applicable
    if (settings.docker !== undefined) {
      build_docker(settings.docker).then((err, res) => {
        if (err) {
          console.error(`[!] Failed to load ${plugin_name}. Docker issue`);
          delete PenPal.RegisteredPlugins[plugin_name];
          delete PenPal.LoadedPlugins[plugin_name];
        }
      });
    }

    plugins_types = mergeTypeDefs([plugins_types, types]);
    plugins_resolvers = _.merge(plugins_resolvers, resolvers);
    plugins_loaders = _.merge(plugins_loaders, loaders);

    PenPal.LoadedPlugins[plugin_name].loaded = true;
    if (settings.datastores) {
      console.log(`[+] Creating DataStores ${plugin_name}`);
      PenPal.DataStore.createStorage(
        PenPal.LoadedPlugins[plugin_name].name,
        settings.datastores
      );
    }
    PenPal.LoadedPlugins[plugin_name].settings = settings;
    console.log(`[+] Loaded ${plugin_name}`);
  }

  for (plugin_name of Object.keys(PenPal.LoadedPlugins)) {
    if (PenPal.LoadedPlugins[plugin_name].loaded === false) {
      delete PenPal.LoadedPlugins[plugin_name];
    }
  }

  return {
    plugins_types,
    plugins_resolvers,
    plugins_loaders,
  };
};

// ----------------------------------------------------------------------------

export default PenPal;
