const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString } = graphql;
var GraphQLDate = require("graphql-date");

const UserType = require("./user_type");
const ListType = require("./list_type");
const MediaType = require("./media_type");

const ListService = require("../../services/list");
const MediaService = require("../../services/media");

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      }
    },
    lists: {
      type: new GraphQLList(ListType),
      resolve(parentValue, args, req) {
        return ListService.fetchAllLists();
      }
    },
    list: {
      type: ListType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parentValue, args, req) {
        return ListService.fetchList(args.id);
      }
    },
    media: {
      type: new GraphQLList(MediaType),
      args: {
        searchQuery: { type: GraphQLString }
      },
      resolve(parentValue, { searchQuery }, req) {
        return MediaService.searchMedia(searchQuery);
      }
    }
  })
});

module.exports = RootQueryType;
