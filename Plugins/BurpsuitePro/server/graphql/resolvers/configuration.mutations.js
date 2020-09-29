import Burpsuite from "../../burpsuite.js";

import queries from "./configuration.queries.js";

export default {
  async setBurpsuiteProConfiguration(
    root,
    { configuration: jsonConfiguration },
    context
  ) {
    const configuration = JSON.parse(jsonConfiguration);
    const { penpal_settings } = configuration;
    Burpsuite.config = { ...penpal_settings };

    return await queries.getBurpsuiteProConfiguration();
  }
};
