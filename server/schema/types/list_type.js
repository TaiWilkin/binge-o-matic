const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const mongoose = require("mongoose");

const List = mongoose.model("list");

const MediaService = require("../../services/media");

const MediaType = require("./media_type");

const ListType = new GraphQLObjectType({
  name: "ListType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    user: { type: GraphQLID },
    media: {
      type: new GraphQLList(MediaType),
      resolve(parentValue, args, req) {
        return MediaService.getMediaList(parentValue.media);
      }
    }
  })
});

module.exports = ListType;
