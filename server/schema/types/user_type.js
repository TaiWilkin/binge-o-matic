import graphql from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

import ListType from "./list_type.js";

import ListService from "../../services/list.js";

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
