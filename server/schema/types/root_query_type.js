import graphql from "graphql";

import ListService from "../../services/list.js";
import MediaService from "../../services/media.js";
import ListType from "./list_type.js";
import MediaType from "./media_type.js";
import UserType from "./user_type.js";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    user: {
      type: UserType,
      resolve(_parentValue, _args, context) {
        return context.user;
      },
    },
    lists: {
      type: new GraphQLList(ListType),
      resolve() {
        return ListService.fetchAllLists();
      },
    },
    list: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(_parentValue, args) {
        return ListService.fetchList(args.id);
      },
    },
    media: {
      type: new GraphQLList(MediaType),
      args: {
        searchQuery: { type: GraphQLString },
      },
      resolve(_parentValue, { searchQuery }) {
        return MediaService.searchMedia(searchQuery);
      },
    },
  }),
});

export default RootQueryType;
