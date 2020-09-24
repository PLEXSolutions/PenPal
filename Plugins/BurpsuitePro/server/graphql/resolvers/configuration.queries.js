import fetch from "node-fetch";

// Temporary until PenPal.Datastore.get() is implemented
import Burpsuite from "../../burpsuite.js";

export default {
  async getBurpsuiteProConfiguration(root, args, context) {
    const penpal_settings = {
      rest_url: Burpsuite.config.rest_url
    };

    if (Burpsuite.config.rest_url === "") {
      // We can't query the REST API until this is set
      return {
        penpal_settings
      };
    }

    // http://localhost:8090/burp/configuration
    console.log("Getting Burp Config");
    const req = await fetch("http://localhost:8090/burp/configuration");
    console.log(req);
    const json = await req.json();
    console.log(json);
    return _.extend(json, { penpal_settings });
  }
};
