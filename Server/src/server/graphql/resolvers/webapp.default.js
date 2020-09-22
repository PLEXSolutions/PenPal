import { generateResolvers } from "./common.js";

const {
  default_resolver,
  default_required_string_resolver,
  default_id_resolver,
  default_map_resolver
} = generateResolvers("webappUsersLoader");

export default {
  WebappUser: {
    id: default_required_string_resolver("_id"),
    emails: async ({ id, ...rest }, args, { redball_loaders }) => {
      const user = await redball_loaders.webappUsersLoader.load(id);
      return user.emails.map(email => email.address);
    }
  },

  WebappAuthResult: {
    async user({ userId, ...rest }, args, { redball_loaders }) {
      const user = await redball_loaders.webappUsersLoader.load(userId);
      user.id = user._id;
      return user;
    }
  }
};
