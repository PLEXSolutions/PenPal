import { Meteor } from "meteor/meteor";
import PenPal from "meteor/penpal";

export default {
  async getPlugins(root, args, context) {
    const plugins_name_version = Object.keys(PenPal.LoadedPlugins);
    return plugins_name_version.map(plugin_name_version => ({
      id: plugin_name_version
    }));
  },

  async getPluginConfigurationSettings(root, { plugin_id }, context) {
    const plugin = PenPal.LoadedPlugins[plugin_id];
    if (plugin === undefined) {
      throw new Meteor.Error(404, "Plugin not found");
    }
    return plugin.settings?.configuration;
  }
};
