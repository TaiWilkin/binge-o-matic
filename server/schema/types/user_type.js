const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const mongoose = require("mongoose");

const User = mongoose.model("user");

const ListType = require("./list_type");

const ListService = require("../../services/list");

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    lists: {
      type: new GraphQLList(ListType),
      resolve(parentValue, args, req) {
        return ListService.fetchUserLists(req.user);
      }
    }
  })
});

module.exports = UserType;
