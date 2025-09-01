import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { timedResolver } from "../../helpers/timedResolver.js";
import ListService from "../../services/list.js";
import MediaService from "../../services/media.js";
import ListType from "./list_type.js";
import MediaType from "./media_type.js";
import UserType from "./user_type.js";

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    user: {
      type: UserType,
      resolve: timedResolver((_parentValue, _args, { user }) => user),
    },
    lists: {
      type: new GraphQLList(ListType),
      resolve: timedResolver(() => {
        return ListService.fetchAllLists();
      }),
    },
    list: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: timedResolver((_parentValue, args) => {
        return ListService.fetchList(args.id);
      }),
    },
    media: {
      type: new GraphQLList(MediaType),
      args: {
        searchQuery: { type: GraphQLString },
      },
      resolve: timedResolver((_parentValue, { searchQuery }) => {
        return MediaService.searchMedia(searchQuery);
      }),
    },
  }),
});

export default RootQueryType;
