import graphql from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
import mongoose from "mongoose";

const User = mongoose.model("user");

import ListType from "./list_type.js";

import ListService from "../../services/list.js";

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    lists: {
      type: new GraphQLList(ListType),
      resolve(parentValue, args, req) {
        return ListService.fetchUserLists(req.user);
      },
    },
  }),
});

export default UserType;
