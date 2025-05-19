import graphql from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

import MediaService from "../../services/media.js";

import MediaType from "./media_type.js";

const ListType = new GraphQLObjectType({
  name: "ListType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    user: { type: GraphQLID },
    media: {
      type: new GraphQLList(MediaType),
      resolve(parentValue) {
        return MediaService.getMediaList(parentValue.media);
      },
    },
  }),
});

export default ListType;
