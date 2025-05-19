import graphql from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

import UserType from "./user_type.js";
import ListType from "./list_type.js";
import MediaType from "./media_type.js";

import ListService from "../../services/list.js";
import MediaService from "../../services/media.js";

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      },
    },
    lists: {
      type: new GraphQLList(ListType),
      resolve(parentValue, args, req) {
        return ListService.fetchAllLists();
      },
    },
    list: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args, req) {
        return ListService.fetchList(args.id);
      },
    },
    media: {
      type: new GraphQLList(MediaType),
      args: {
        searchQuery: { type: GraphQLString },
      },
      resolve(parentValue, { searchQuery }, req) {
        return MediaService.searchMedia(searchQuery);
      },
    },
  }),
});

export default RootQueryType;
