export default {
  async setBurpsuiteProConfiguration(
    root,
    { configuration: jsonConfiguration },
    context
  ) {
    const configuration = JSON.parse(jsonConfiguration);
    const { penpal_settings } = configuration;
    console.log(penpal_settings);
    return {};
  }
};
