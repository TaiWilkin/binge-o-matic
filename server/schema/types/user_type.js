import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { timedResolver } from "../../helpers/timedResolver.js";
import ListService from "../../services/list.js";
import ListType from "./list_type.js";

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    lists: {
      type: new GraphQLList(ListType),
      resolve: timedResolver(async (_parentValue, _args, context) => {
        return ListService.fetchUserLists(context.user);
      }),
    },
  }),
});

export default UserType;
