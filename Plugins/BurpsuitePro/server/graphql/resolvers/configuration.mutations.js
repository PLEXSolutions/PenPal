import Burpsuite from "../../burpsuite.js";

export default {
  async setBurpsuiteProConfiguration(
    root,
    { configuration: jsonConfiguration },
    context
  ) {
    const configuration = JSON.parse(jsonConfiguration);
    const { penpal_settings } = configuration;
    Burpsuite.config.rest_url = penpal_settings.rest_url;
    return { configuration };
  }
};
