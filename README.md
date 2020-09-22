PenPal
======

PenPal is an automation and reporting all-in-one tool that is meant to enable Cybersecurity Engineers to perform a better, more thorough job and produce better quality reports by automating many of the most tedious tasks in penetration testing and/or red teaming. It is built on a pluggable architecture that can allow for many tools to be integrated seamlessly into the structured, opinionated database scheme. This allows for a consistent approach to targeting that can enable trigger-based automations to perform actions when a condition occurs or on-demand.



## Plugin API (v0.1)

Below is documentation describing how plugins should be structured and what is required.

### Plugin structure (server)

Each plugin is required to have three server files: `index.js`, `manifest.json`, and `plugin.js`. The simplest possible plugin is shown in the snippets below:

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

Required functions on `plugins.js` exported object:

 - `loadPlugin()`: This function takes no arguments and returns one object with `types`, `resolvers`, `loaders`, and `settings` fields to define the schema and resolvers that can be used to interact with the plugin. The settings object contains all of the specific info that defines how the plugin queries will interact with the user interface.

### Settings

The sections below enumerate the different settings available and what they do:

#### Configuration

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
