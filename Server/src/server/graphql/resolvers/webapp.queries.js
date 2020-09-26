import { Meteor } from "meteor/meteor";
import _ from "lodash";

import { CONSTANTS } from "/lib/common.js";
import { restrictToRole, restrictToLoggedIn } from "./common.js";

export default {
  async currentUser(root, args, { user }) {
    restrictToLoggedIn(user);

    return user;
  },

  async getUsers(
    root,
    { filter: { active, pending } = {} },
    { user, redball_loaders }
  ) {
    restrictToRole(user, CONSTANTS.ROLE.ADMIN);

    const query = {};

    switch (true) {
      case active:
        query["settings.enabled"] = true;
        break;
      case pending:
        query["settings.enabled"] = false;
        break;
    }

    let users = await Meteor.users.find(query).fetch();
    users = users.map(({ _id, ...rest }) => ({ _id, id: _id, ...rest }));
    for (user of users) {
      await redball_loaders.webappUsersLoader.prime(user.id, user);
    }

    return users;
  },

  async nop() {
    return false;
  }
};
