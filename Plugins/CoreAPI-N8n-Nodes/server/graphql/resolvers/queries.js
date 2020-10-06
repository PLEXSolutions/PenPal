import PenPal from "meteor/penpal";
import { Mongo } from "meteor/mongo";
import _ from "lodash";

export default {
  async coreAPIGetHostData(root, { data }, context) {
    console.log("CoreAPIGetHostData", data);
    return [];
  }
};
