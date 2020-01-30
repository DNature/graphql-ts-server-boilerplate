import { ResolverMap } from "../../types/graphql-utils";
import { removeAllUsersSessions } from "../../utils/removeAllUsersSessions";

export const resolvers: ResolverMap = {
  Query: {
    dummy: () => "dummty"
  },

  Mutation: {
    logout: async (_, __, { session, redis }) => {
      const { userId } = session;
      if (userId) {
        removeAllUsersSessions(userId, redis);
        return true;
      }
      return false;
    }
  }
};
