import graphql from "graphql";
import GraphQLDate from "graphql-date";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

const MediaType = new GraphQLObjectType({
  name: "MediaType",
  fields: () => ({
    id: { type: GraphQLID }, // this is the MLab id
    title: { type: GraphQLString },
    release_date: { type: GraphQLDate },
    media_type: { type: GraphQLString },
    poster_path: { type: GraphQLString },
    media_id: { type: GraphQLString }, // this is the TMDB id
    number: { type: GraphQLInt },
    isWatched: { type: GraphQLBoolean },
    show_children: { type: GraphQLBoolean },
    parent_show: {
      type: GraphQLID,
      resolve(parentValue) {
        return parentValue.parent_show || null; // this is the TMDB id
      },
    },
    parent_season: {
      type: GraphQLID,
      resolve(parentValue) {
        return parentValue.parent_season || null; // this is the TMDB id
      },
    },
    episode: { type: GraphQLString },
  }),
});

export default MediaType;
