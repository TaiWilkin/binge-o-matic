import graphql from "graphql";

import MediaService from "../../services/media.js";
import MediaType from "./media_type.js";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

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
