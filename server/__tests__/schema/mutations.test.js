// Import models to register them with mongoose
import "../../models/index.js";

import { jest } from "@jest/globals";
import graphql from "graphql";
import GraphQLDate from "graphql-date";

import mutation from "../../schema/mutations.js";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
} = graphql;

// Mock all services at module level
jest.mock("../../services/auth.js", () => ({
  default: {
    signup: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock("../../services/list.js", () => ({
  default: {
    createList: jest.fn(),
    deleteList: jest.fn(),
    editList: jest.fn(),
  },
}));

jest.mock("../../services/media.js", () => ({
  default: {
    addToList: jest.fn(),
    removeFromList: jest.fn(),
    toggleWatched: jest.fn(),
    hideChildren: jest.fn(),
    addEpisodes: jest.fn(),
    addSeasons: jest.fn(),
  },
}));

describe("GraphQL Mutations Schema", () => {
  // Helper function to convert GraphQL args array to object
  const argsToObject = (args) => {
    const argsObj = {};
    if (args && Array.isArray(args)) {
      args.forEach((arg) => {
        argsObj[arg.name] = arg;
      });
    }
    return argsObj;
  };

  describe("Basic Structure", () => {
    it("should be a GraphQLObjectType", () => {
      expect(mutation).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(mutation.name).toBe("Mutation");
    });

    it("should have all expected mutation fields", () => {
      const fields = mutation.getFields();
      const expectedFields = [
        "signup",
        "logout",
        "login",
        "createList",
        "addToList",
        "removeFromList",
        "toggleWatched",
        "hideChildren",
        "addEpisodes",
        "addSeasons",
        "deleteList",
        "editList",
      ];

      expectedFields.forEach((fieldName) => {
        expect(fields[fieldName]).toBeDefined();
      });

      expect(Object.keys(fields)).toHaveLength(12);
    });

    it("should have function resolvers for all mutations", () => {
      const fields = mutation.getFields();
      Object.keys(fields).forEach((fieldName) => {
        expect(typeof fields[fieldName].resolve).toBe("function");
      });
    });
  });

  describe("Auth Mutations Schema", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct signup mutation schema", () => {
      const signup = fields.signup;
      expect(signup.type.name).toBe("UserType");

      const args = argsToObject(signup.args);
      expect(args.email).toBeDefined();
      expect(args.email.type).toBe(GraphQLString);
      expect(args.password).toBeDefined();
      expect(args.password.type).toBe(GraphQLString);
    });

    it("should have correct login mutation schema", () => {
      const login = fields.login;
      expect(login.type.name).toBe("UserType");

      const args = argsToObject(login.args);
      expect(args.email).toBeDefined();
      expect(args.email.type).toBe(GraphQLString);
      expect(args.password).toBeDefined();
      expect(args.password.type).toBe(GraphQLString);
    });

    it("should have correct logout mutation schema", () => {
      const logout = fields.logout;
      expect(logout.type.name).toBe("UserType");
      expect(logout.args).toHaveLength(0);
    });
  });

  describe("List Mutations Schema", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct createList mutation schema", () => {
      const createList = fields.createList;
      expect(createList.type.name).toBe("ListType");

      const args = argsToObject(createList.args);
      expect(args.name).toBeDefined();
      expect(args.name.type).toBe(GraphQLString);
    });

    it("should have correct deleteList mutation schema", () => {
      const deleteList = fields.deleteList;
      expect(deleteList.type.name).toBe("ListType");

      const args = argsToObject(deleteList.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
    });

    it("should have correct editList mutation schema", () => {
      const editList = fields.editList;
      expect(editList.type.name).toBe("ListType");

      const args = argsToObject(editList.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.name).toBeDefined();
      expect(args.name.type).toBe(GraphQLString);
    });
  });

  describe("Media Mutations Schema", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct addToList mutation schema", () => {
      const addToList = fields.addToList;
      expect(addToList.type.name).toBe("ListType");

      const args = argsToObject(addToList.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.title).toBeDefined();
      expect(args.title.type).toBe(GraphQLString);
      expect(args.release_date).toBeDefined();
      expect(args.release_date.type).toBe(GraphQLDate);
      expect(args.poster_path).toBeDefined();
      expect(args.poster_path.type).toBe(GraphQLString);
      expect(args.media_type).toBeDefined();
      expect(args.media_type.type).toBe(GraphQLString);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
    });

    it("should have correct removeFromList mutation schema", () => {
      const removeFromList = fields.removeFromList;
      expect(removeFromList.type.name).toBe("ListType");

      const args = argsToObject(removeFromList.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
    });

    it("should have correct toggleWatched mutation schema", () => {
      const toggleWatched = fields.toggleWatched;
      expect(toggleWatched.type.name).toBe("MediaType");

      const args = argsToObject(toggleWatched.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
      expect(args.isWatched).toBeDefined();
      expect(args.isWatched.type).toBe(GraphQLBoolean);
    });

    it("should have correct hideChildren mutation schema", () => {
      const hideChildren = fields.hideChildren;
      expect(hideChildren.type.name).toBe("MediaType");

      const args = argsToObject(hideChildren.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
    });

    it("should have correct addEpisodes mutation schema", () => {
      const addEpisodes = fields.addEpisodes;
      expect(addEpisodes.type.name).toBe("ListType");

      const args = argsToObject(addEpisodes.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
      expect(args.season_number).toBeDefined();
      expect(args.season_number.type).toBe(GraphQLInt);
      expect(args.show_id).toBeDefined();
      expect(args.show_id.type).toBe(GraphQLID);
    });

    it("should have correct addSeasons mutation schema", () => {
      const addSeasons = fields.addSeasons;
      expect(addSeasons.type.name).toBe("ListType");

      const args = argsToObject(addSeasons.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.media_id).toBeDefined();
      expect(args.media_id.type).toBe(GraphQLID);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
    });
  });

  describe("Return Types", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct return types for auth mutations", () => {
      expect(fields.signup.type.name).toBe("UserType");
      expect(fields.login.type.name).toBe("UserType");
      expect(fields.logout.type.name).toBe("UserType");
    });

    it("should have correct return types for list mutations", () => {
      expect(fields.createList.type.name).toBe("ListType");
      expect(fields.deleteList.type.name).toBe("ListType");
      expect(fields.editList.type.name).toBe("ListType");
    });

    it("should have correct return types for media mutations", () => {
      expect(fields.addToList.type.name).toBe("ListType");
      expect(fields.removeFromList.type.name).toBe("ListType");
      expect(fields.toggleWatched.type.name).toBe("MediaType");
      expect(fields.hideChildren.type.name).toBe("MediaType");
      expect(fields.addEpisodes.type.name).toBe("ListType");
      expect(fields.addSeasons.type.name).toBe("ListType");
    });
  });

  describe("Type Consistency", () => {
    it("should use correct GraphQL types consistently", () => {
      const fields = mutation.getFields();

      // Check that all ID fields use GraphQLID
      const addToListArgs = argsToObject(fields.addToList.args);
      expect(addToListArgs.id.type).toBe(GraphQLID);
      expect(addToListArgs.list.type).toBe(GraphQLID);

      // Check that date fields use GraphQLDate
      expect(addToListArgs.release_date.type).toBe(GraphQLDate);

      // Check that boolean fields use GraphQLBoolean
      const toggleWatchedArgs = argsToObject(fields.toggleWatched.args);
      expect(toggleWatchedArgs.isWatched.type).toBe(GraphQLBoolean);

      // Check that integer fields use GraphQLInt
      const addEpisodesArgs = argsToObject(fields.addEpisodes.args);
      expect(addEpisodesArgs.season_number.type).toBe(GraphQLInt);
    });

    it("should have consistent field structure", () => {
      const fields = mutation.getFields();

      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName];
        expect(field).toHaveProperty("type");
        expect(field).toHaveProperty("args");
        expect(field).toHaveProperty("resolve");
        expect(typeof field.resolve).toBe("function");
      });
    });
  });
});
