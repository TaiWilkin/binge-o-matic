const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLList,
} = graphql;
var GraphQLDate = require('graphql-date')

const UserType = require('./types/user_type');
const ListType = require('./types/list_type');
const MediaType = require('./types/media_type');

const AuthService = require('../services/auth');
const ListService = require('../services/list');
const MediaService = require('../services/media');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.signup({ email, password, req });
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
        return AuthService.logout(req);
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req });
      }
    },
    createList: {
      type: ListType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parentValue, { name }, req) {
        return ListService.createList(name, req.user);
      }
    },
    addToList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        release_date: { type: GraphQLDate },
        poster_path: { type: GraphQLString },
        media_type: { type: GraphQLString },
        list: { type: GraphQLID }
      },
      resolve(parentValue, args, req) {
        return MediaService.addToList(args, req.user);
      }
    },
    removeFromList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
      },
      resolve(parentValue, args, req) {
        return MediaService.removeFromList(args, req.user);
      }
    },
    toggleWatched: {
      type: MediaType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
        isWatched: { type: GraphQLBoolean },
      },
      resolve(parentValue, args, req) {
        return MediaService.toggleWatched(args);
      }
    },
    addEpisodes: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        list: { type: GraphQLID },
        season_number: { type: GraphQLInt },
        show_id: { type: GraphQLID },
      },
      resolve(parentValue, args, req) {
        return MediaService.addEpisodes(args);
      }
    },
    addSeasons: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        media_id: { type: GraphQLID },
        list: { type: GraphQLID },
      },
      resolve(parentValue, args, req) {
        return MediaService.addSeasons(args);
      }
    },
    deleteList: {
      type: ListType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parentValue, args, req) {
        return ListService.deleteList(args, req.user);
      }
    },
    editList: {
      type: ListType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString }
      },
      resolve(parentValue, args, req) {
        return ListService.editList(args, req.user);
      }
    }
  })
});

module.exports = mutation;
