import _ from "lodash";

export const CachingDefaultResolvers = (API, Fields) => {
  const resolvers = {};

  for (let field of Fields) {
    resolvers[field] = async ({ id }, __, { PenPalCachingAPI }) =>
      (await PenPalCachingAPI[API]?.Get(id))?.[field];
  }

  return resolvers;
};
