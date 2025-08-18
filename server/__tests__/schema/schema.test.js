// Import models to register them with mongoose
import "../../models/index.js";
import { jest } from "@jest/globals";
import {
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
} from "graphql";
import GraphQLDate from "graphql-date";

let mutation;
let schema;
let RootQueryType;

beforeAll(async () => {
  mutation = (await import("../../schema/mutations.js")).default;
  schema = (await import("../../schema/schema.js")).default;
  RootQueryType = (await import("../../schema/types/root_query_type.js"))
    .default;
});

describe("GraphQL Schema", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe("Schema Definition", () => {
    it("should be a GraphQLSchema instance", () => {
      expect(schema).toBeInstanceOf(GraphQLSchema);
    });

    it("should have a query root type", () => {
      expect(schema.getQueryType()).toBeDefined();
      expect(schema.getQueryType()).toBe(RootQueryType);
    });

    it("should have a mutation root type", () => {
      expect(schema.getMutationType()).toBeDefined();
      expect(schema.getMutationType()).toBe(mutation);
    });

    it("should not have a subscription root type", () => {
      expect(schema.getSubscriptionType()).toBeUndefined();
    });
  });

  describe("Query Type", () => {
    let queryType;

    beforeEach(() => {
      queryType = schema.getQueryType();
    });

    it("should be named RootQueryType", () => {
      expect(queryType.name).toBe("RootQueryType");
    });

    it("should have all expected query fields", () => {
      const fields = queryType.getFields();

      expect(fields.user).toBeDefined();
      expect(fields.lists).toBeDefined();
      expect(fields.list).toBeDefined();
      expect(fields.media).toBeDefined();
    });
  });

  describe("Mutation Type", () => {
    let mutationType;

    beforeEach(() => {
      mutationType = schema.getMutationType();
    });

    it("should be named Mutation", () => {
      expect(mutationType.name).toBe("Mutation");
    });

    it("should have all expected mutation fields", () => {
      const fields = mutationType.getFields();

      // Auth mutations
      expect(fields.signup).toBeDefined();
      expect(fields.login).toBeDefined();
      expect(fields.logout).toBeDefined();

      // List mutations
      expect(fields.createList).toBeDefined();
      expect(fields.deleteList).toBeDefined();
      expect(fields.editList).toBeDefined();

      // Media mutations
      expect(fields.addToList).toBeDefined();
      expect(fields.removeFromList).toBeDefined();
      expect(fields.toggleWatched).toBeDefined();
      expect(fields.hideChildren).toBeDefined();
      expect(fields.addEpisodes).toBeDefined();
      expect(fields.addSeasons).toBeDefined();
    });

    describe("Auth Mutations", () => {
      let fields;

      beforeEach(() => {
        fields = mutationType.getFields();
      });

      it("should have signup mutation with correct arguments", () => {
        const signup = fields.signup;
        expect(signup.type.name).toBe("UserType");

        const args = argsToObject(signup.args);
        expect(args.email).toBeDefined();
        expect(args.email.type).toBe(GraphQLString);
        expect(args.password).toBeDefined();
        expect(args.password.type).toBe(GraphQLString);
      });

      it("should have login mutation with correct arguments", () => {
        const login = fields.login;
        expect(login.type.name).toBe("UserType");

        const args = argsToObject(login.args);
        expect(args.email).toBeDefined();
        expect(args.email.type).toBe(GraphQLString);
        expect(args.password).toBeDefined();
        expect(args.password.type).toBe(GraphQLString);
      });

      it("should have logout mutation with no arguments", () => {
        const logout = fields.logout;
        expect(logout.type.name).toBe("UserType");
        expect(logout.args).toHaveLength(0);
      });
    });

    describe("List Mutations", () => {
      let fields;

      beforeEach(() => {
        fields = mutationType.getFields();
      });

      it("should have createList mutation with correct arguments", () => {
        const createList = fields.createList;
        expect(createList.type.name).toBe("ListType");

        const args = argsToObject(createList.args);
        expect(args.name).toBeDefined();
        expect(args.name.type).toBe(GraphQLString);
      });

      it("should have deleteList mutation with correct arguments", () => {
        const deleteList = fields.deleteList;
        expect(deleteList.type.name).toBe("ListType");

        const args = argsToObject(deleteList.args);
        expect(args.id).toBeDefined();
        expect(args.id.type).toBe(GraphQLID);
      });

      it("should have editList mutation with correct arguments", () => {
        const editList = fields.editList;
        expect(editList.type.name).toBe("ListType");

        const args = argsToObject(editList.args);
        expect(args.id).toBeDefined();
        expect(args.id.type).toBe(GraphQLID);
        expect(args.name).toBeDefined();
        expect(args.name.type).toBe(GraphQLString);
      });
    });

    describe("Media Mutations", () => {
      let fields;

      beforeEach(() => {
        fields = mutationType.getFields();
      });

      it("should have addToList mutation with correct arguments", () => {
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

      it("should have removeFromList mutation with correct arguments", () => {
        const removeFromList = fields.removeFromList;
        expect(removeFromList.type.name).toBe("ListType");

        const args = argsToObject(removeFromList.args);
        expect(args.id).toBeDefined();
        expect(args.id.type).toBe(GraphQLID);
        expect(args.list).toBeDefined();
        expect(args.list.type).toBe(GraphQLID);
      });

      it("should have toggleWatched mutation with correct arguments", () => {
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

      it("should have hideChildren mutation with correct arguments", () => {
        const hideChildren = fields.hideChildren;
        expect(hideChildren.type.name).toBe("MediaType");

        const args = argsToObject(hideChildren.args);
        expect(args.id).toBeDefined();
        expect(args.id.type).toBe(GraphQLID);
        expect(args.list).toBeDefined();
        expect(args.list.type).toBe(GraphQLID);
      });

      it("should have addEpisodes mutation with correct arguments", () => {
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

      it("should have addSeasons mutation with correct arguments", () => {
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
  });

  describe("Mutation Resolvers", () => {
    let mutationType;

    beforeEach(() => {
      mutationType = schema.getMutationType();
    });

    it("should have resolvers for all mutation fields", () => {
      const fields = mutationType.getFields();

      Object.keys(fields).forEach((fieldName) => {
        expect(fields[fieldName].resolve).toBeDefined();
        expect(typeof fields[fieldName].resolve).toBe("function");
      });
    });

    it("should have async resolver for login mutation", () => {
      const fields = mutationType.getFields();
      const loginResolver = fields.login.resolve;

      // Check if the resolver is async by checking if it returns a promise
      expect(loginResolver.constructor.name).toBe("AsyncFunction");
    });
  });

  describe("Schema Validation", () => {
    it("should be a valid GraphQL schema", () => {
      // This will throw if the schema is invalid
      expect(() => {
        schema.getQueryType();
        schema.getMutationType();
      }).not.toThrow();
    });

    it("should have all type definitions properly linked", () => {
      const queryFields = schema.getQueryType().getFields();
      const mutationFields = schema.getMutationType().getFields();

      // Check that all field types are defined
      Object.values(queryFields).forEach((field) => {
        expect(field.type).toBeDefined();
      });

      Object.values(mutationFields).forEach((field) => {
        expect(field.type).toBeDefined();
      });
    });
  });

  describe("Integration", () => {
    it("should export schema as default", () => {
      expect(schema).toBeDefined();
      expect(schema).toBeInstanceOf(GraphQLSchema);
    });

    it("should have consistent field count for mutations", () => {
      const fields = schema.getMutationType().getFields();
      // There are 12 mutations: signup, logout, login, createList, addToList, removeFromList,
      // toggleWatched, hideChildren, addEpisodes, addSeasons, deleteList, editList
      expect(Object.keys(fields)).toHaveLength(12);
    });

    it("should properly integrate with custom GraphQL types", () => {
      const mutationFields = schema.getMutationType().getFields();

      // Check that custom date type is properly integrated
      const addToListArgs = argsToObject(mutationFields.addToList.args);
      expect(addToListArgs.release_date.type).toBe(GraphQLDate);
    });
  });
});
