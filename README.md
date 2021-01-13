PenPal
======

PenPal is an automation and reporting all-in-one tool that is meant to enable Cybersecurity Engineers to perform a better, more thorough job and produce better quality reports by automating many of the most tedious tasks in penetration testing and/or red teaming. It is built on a pluggable architecture that can allow for many tools to be integrated seamlessly into the structured, opinionated database scheme. This allows for a consistent approach to targeting that can enable trigger-based automations to perform actions when a condition occurs or on-demand.

## Features

 - [ ] Core API for data standardization (Plugin)
     - [x] Customers (can have many projects)
     - [x] Projects
     - [x] Hosts
     - [x] Networks (have many hosts)
     - [ ] Services (ports, etc)
     - [ ] Vulnerabilities
     - [ ] Credentials
     - [ ] Files
     - [ ] Notes
     - [ ] Audit trails
 - [x] DataStore abstraction layer
 - [ ] DataStore Adapters
     - [x] Mongo Adapter
     - [ ] Postgres Adapter (Plugin)
     - [ ] Grepable Filesystem Adapter (Plugin)
     - [ ] S3 Adapter
         - [ ] [MinIO](https://min.io) (Plugin)
         - [ ] Amazon S3 (Plugin)
 - [x] Docker support for plugins
 - [x] [N8n](https://n8n.io) for custom workflow automation (Plugin)
 - [ ] Report generation
     - [ ] [Writehat](https://github.com/blacklanternsecurity/writehat) (Plugin)

## Plugin Ideas

 - [ ] Really anything from the core
 - [ ] Ping sweep for IP range (host discovery -> add hosts via API)
 - [ ] Nmap for service discovery for hosts or networks (host/service discovery -> add hosts/services via API)
 - [x] Masscan for service discovery for hosts or networks (host/service discovery -> add hosts/services via API)
 - [ ] Burpsuite for vulnerability scanning
 - [ ] Dirb/dirbuster/insert URL discovery here
 - [ ] [Gowitness](https://hub.docker.com/r/leonjza/gowitness) for screenshots of websites
 - [ ] [Eyeballer](https://github.com/BishopFox/eyeballer) for searching screenshots for interesting things
 - [ ] [Changeme](https://github.com/ztgrace/changeme) for default password checking

## Plugin Development

Below is documentation describing how plugins should be structured and what is required. Plugins are loaded live by the [Meteor](https://meteor.com) build system and therefore you should be careful of side effects within your code -- every file is executed. Because there is no guaranteed load order, the PenPal Meteor Plugin provides some functions that will allow a plugin to register itself (including specifying dependencies) and then PenPal will load dependencies in order. This is described in more detail in the next section.

### Plugin structure (server)

Each plugin is required to have three server files: `index.js`, `manifest.json`, and `plugin.js`. In general, the `index.js` will register the plugin, the `manifest.json` describes the plugin, and the the `plugin.js` implements the plugin. The simplest possible plugin is shown in the snippets below:

File Structure:
```
plugins/
|-> Base/
|-> CoreAPI/
|-> YourPlugin/
|   |-> package.json (optional, if you have npm dependencies)
|   |-> server/
|   |   |-> index.js
|   |   |-> manifest.json
|   |   |-> plugin.js
```

`index.js`:
```js
// The code below is used to register a plugin (at runtime), which will then be loaded 
// once the main server finishes starting up.

// Overall PenPal coordinating server code
import PenPal from "meteor/penpal";

// Plugin-specific info
import Plugin from "./plugin.js";
import Manifest from "./manifest.json";

// Register the plugin
PenPal.registerPlugin(Manifest, Plugin);
```

`manifest.json`:
```json
{
    "name": "MyCoolPlugin",
    "version": "0.1.0",
    "dependsOn": ["AnotherPlugin@0.1.0"]
}
```

`plugin.js`:
```js
// This defines the custom server-side code being run by the plugin. It has GraphQL schemas and resolvers
// in order to interact with the plugged application
import { types, resolvers, loaders } from "./graphql";

const settings = {};

const MyCoolPlugin = {
  loadPlugin() {
    return {
      types,
      resolvers,
      loaders,
      settings
    };
  }
};

export default MyCoolPlugin;
```

### Plugin API

`PenPal`
 - `registerPlugin(manifest, plugin)` - this function registers the plugin with PenPal for it to be loaded. It takes two arguments:
     - `manifest` (required) - an object containing decriptive fields about the plugin, defined in the `Manifest` section below
     - `plugin` (required) - an object containing fields that associate with the code of the plugin, defined in the `Plugin` section below

`Manifest`
 - `name` (required) - a `String` that is a unique name for the plugin
 - `version` (required) - a `String` in semantic versioning form
 - `dependsOn` (required) - a `[String]` where each `String` is of the form `name@version` for plugins. Your plugin will not load if any of the dependencies are missing
 - `requiresImplementation` (optional) - a `Boolean` specifying whether another plugin must implement this one in order to load. This is currently used by the `DataStore` plugin, which defines a general API for interacting with data store plugins but does not actually implement one.
 - `implements` (optional) - a `String` of the form `name@version` that specifies if the plugin implements another plugins specification. For example, `DataStoreMongoAdapter` implements the `DataStore` specification.

`Plugin`
 - `loadPlugin()` - This function takes no arguments and returns one object with `types`, `resolvers`, `loaders`, and `settings` fields to define the schema and resolvers that can be used to interact with the plugin. The settings object contains all of the specific info that defines how the plugin queries will interact with the user interface and other server-side APIs (more on this in the `Settings` section).
 - `startupHook()` - This function takes no arguments but is guaranteed to execute _after_ all other plugins have been loaded and after all core services are running (databases, the GraphQL server, etc). This is useful for loading persisted data, as shown in [Plugins/N8n/server/plugin.js](https://github.com/PLEXSolutions/PenPal/blob/master/Plugins/N8n/server/plugin.js#L28) -- this startup hook is used to load all saved webhooks from a database so that N8n workflows can be persisted across runs of PenPal.

### Settings

The sections below enumerate the different settings available and what they do. Much of this is subject to change, so take the documentation with a grain of salt and look at examples for current functionality.

#### Configuration (unstable atm)

To utilize the automatic configuration page generator, utilize the following field in the settings object, which will allow PenPal to introspect your schema and generate a configuration editor

```json
{
    "configuration": {
        "schema_root": "MyCoolPluginConfiguration",
        "getter": "getMyCoolPluginConfiguration",
        "setter": "setMyCoolPluginConfiguration"
    }
}
```

#### Datastore

This section of the settings object is used to automatically generate data stores (using the DataStore API). It can be used for actual PenPal data or just configuration information for you plugin. For example, in [Plugins/N8n/server/plugin.js](https://github.com/PLEXSolutions/PenPal/blob/master/Plugins/N8n/server/plugin.js#L28) it defines a collection for storing webhook URLs for N8n. The `datastores` field of the `settings` object is an `[Object]` where each `Object` has a `name` field. The `name` is automatically prepended with your plugin name, so it is automatically namespaced. There is planned functionality for things like unique data stores for data types (S3 stores for `files`, relational DB for data, etc), but that is not yet implemented.

```json
{
    "datastores": [
        {
            "name": "YourCollectionName"
        }
    ]
}
```

#### Docker

This section of the settings object is used to automatically pull docker images (not yet implemented) or build provided docker files (implemented) at runtime. This is an easy way to make sure that your particular plugin is cross platform and can be executed regardless of where PenPal is running. See the [Masscan Plugin](https://github.com/PLEXSolutions/PenPal/blob/master/Plugins/Masscan/server/plugin.js#L4) for an example.

#### N8n (unstable)

You can define n8n nodes and then PenPal will automatically generate them at runtime, including connecting the plumbing between the N8n server and your functions you define. This is a bit rigid at the moment and relies a lot on naming -- there are plans in place to make this a bit more API-like, similar to how knex abstracts SQL queries. See [CoreAPI-N8n-Nodes/server/plugin.js](https://github.com/PLEXSolutions/PenPal/blob/master/Plugins/CoreAPI-N8n-Nodes/server/plugin.js#L5) for an example.


