import graphql from "graphql";
import GraphQLDate from "graphql-date";

import AuthService from "../services/auth.js";
import ListService from "../services/list.js";
import MediaService from "../services/media.js";
import ListType from "./types/list_type.js";
import MediaType from "./types/media_type.js";
import UserType from "./types/user_type.js";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
} = graphql;

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(_parentValue, { email, password }, context) {
        return AuthService.signup({ email, password, req: context.req });
      },
    },
    logout: {
      type: UserType,
      resolve(_parentValue, _args, context) {
        return AuthService.logout(context.req);
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_parent, { email, password }, context) {
        const { user } = await AuthService.login({ email, password, context });
        return user;
      },
    },
    createList: {
      type: ListType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(_parentValue, { name }, context) {
        return ListService.createList(name, context.user);
      },
    },
    addToList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        release_date: { type: GraphQLDate },
        poster_path: { type: GraphQLString },
        media_type: { type: GraphQLString },
        list: { type: GraphQLID },
      },
      resolve(_parentValue, args, context) {
        return MediaService.addToList(args, context.user);
      },
    },
    removeFromList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
      },
      resolve(_parentValue, args, context) {
        return MediaService.removeFromList(args, context.user);
      },
    },
    toggleWatched: {
      type: MediaType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
        isWatched: { type: GraphQLBoolean },
      },
      resolve(_parentValue, args) {
        return MediaService.toggleWatched(args);
      },
    },
    hideChildren: {
      type: MediaType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
      },
      resolve(_parentValue, args) {
        return MediaService.hideChildren(args);
      },
    },
    addEpisodes: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
        season_number: { type: GraphQLInt },
        show_id: { type: GraphQLID },
      },
      resolve(_parentValue, args) {
        return MediaService.addEpisodes(args);
      },
    },
    addSeasons: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        media_id: { type: GraphQLID },
        list: { type: GraphQLID },
      },
      resolve(_parentValue, args) {
        return MediaService.addSeasons(args);
      },
    },
    deleteList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(_parentValue, args, context) {
        return ListService.deleteList(args, context.user);
      },
    },
    editList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      resolve(_parentValue, args, context) {
        return ListService.editList(args, context.user);
      },
    },
  }),
});

export default mutation;
