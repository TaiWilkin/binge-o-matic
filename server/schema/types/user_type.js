import graphql from "graphql";

import ListService from "../../services/list.js";
import ListType from "./list_type.js";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    lists: {
      type: new GraphQLList(ListType),
      resolve(_parentValue, _args, req) {
        return ListService.fetchUserLists(req.user);
      },
    },
  }),
});

export default UserType;
