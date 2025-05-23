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
      resolve(_parentValue, { email, password }, req) {
        return AuthService.signup({ email, password, req });
      },
    },
    logout: {
      type: UserType,
      resolve(_parentValue, _args, req) {
        return AuthService.logout(req);
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(_parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req });
      },
    },
    createList: {
      type: ListType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(_parentValue, { name }, req) {
        return ListService.createList(name, req.user);
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
      resolve(_parentValue, args, req) {
        return MediaService.addToList(args, req.user);
      },
    },
    removeFromList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
      },
      resolve(_parentValue, args, req) {
        return MediaService.removeFromList(args, req.user);
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
      resolve(_parentValue, args, req) {
        return ListService.deleteList(args, req.user);
      },
    },
    editList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      resolve(_parentValue, args, req) {
        return ListService.editList(args, req.user);
      },
    },
  }),
});

export default mutation;
