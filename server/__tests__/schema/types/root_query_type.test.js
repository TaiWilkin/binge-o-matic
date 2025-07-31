// Import models to register them with mongoose
import "../../../models/index.js";

import { jest } from "@jest/globals";
import graphql from "graphql";

import RootQueryType from "../../../schema/types/root_query_type.js";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

describe("RootQueryType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Type Definition", () => {
    it("should be a GraphQLObjectType", () => {
      expect(RootQueryType).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(RootQueryType.name).toBe("RootQueryType");
    });

    it("should have all required fields", () => {
      const fields = RootQueryType.getFields();

      expect(fields.user).toBeDefined();
      expect(fields.lists).toBeDefined();
      expect(fields.list).toBeDefined();
      expect(fields.media).toBeDefined();
    });
  });

  describe("Field Types", () => {
    let fields;

    beforeEach(() => {
      fields = RootQueryType.getFields();
    });

    it("should have correct field types", () => {
      // Note: We can't easily test the specific type references without importing them
      // which would cause circular dependency issues in tests
      expect(fields.user.type).toBeDefined();
      expect(fields.lists.type).toBeInstanceOf(GraphQLList);
      expect(fields.list.type).toBeDefined();
      expect(fields.media.type).toBeInstanceOf(GraphQLList);
    });
  });

  describe("Field Arguments", () => {
    let fields;

    beforeEach(() => {
      fields = RootQueryType.getFields();
    });

    it("should have no arguments for user field", () => {
      expect(Array.isArray(fields.user.args)).toBe(true);
      expect(fields.user.args.length).toBe(0);
    });

    it("should have no arguments for lists field", () => {
      expect(Array.isArray(fields.lists.args)).toBe(true);
      expect(fields.lists.args.length).toBe(0);
    });

    it("should have id argument for list field", () => {
      expect(Array.isArray(fields.list.args)).toBe(true);
      expect(fields.list.args.length).toBe(1);
      expect(fields.list.args[0].name).toBe("id");
      expect(fields.list.args[0].type).toBe(GraphQLID);
    });

    it("should have searchQuery argument for media field", () => {
      expect(Array.isArray(fields.media.args)).toBe(true);
      expect(fields.media.args.length).toBe(1);
      expect(fields.media.args[0].name).toBe("searchQuery");
      expect(fields.media.args[0].type).toBe(GraphQLString);
    });
  });

  describe("Field Resolvers", () => {
    let fields;

    beforeEach(() => {
      fields = RootQueryType.getFields();
    });

    it("should have resolvers for all fields", () => {
      expect(fields.user.resolve).toBeDefined();
      expect(fields.lists.resolve).toBeDefined();
      expect(fields.list.resolve).toBeDefined();
      expect(fields.media.resolve).toBeDefined();

      expect(typeof fields.user.resolve).toBe("function");
      expect(typeof fields.lists.resolve).toBe("function");
      expect(typeof fields.list.resolve).toBe("function");
      expect(typeof fields.media.resolve).toBe("function");
    });

    describe("user resolver", () => {
      it("should return context.user", () => {
        const mockUser = { id: "user123", email: "test@example.com" };
        const mockContext = { user: mockUser };

        const result = fields.user.resolve(null, null, mockContext);

        expect(result).toBe(mockUser);
      });

      it("should handle undefined context.user", () => {
        const mockContext = { user: undefined };

        const result = fields.user.resolve(null, null, mockContext);

        expect(result).toBeUndefined();
      });
    });
  });

  describe("Integration", () => {
    it("should export RootQueryType as default", () => {
      expect(RootQueryType).toBeDefined();
      expect(RootQueryType.name).toBe("RootQueryType");
    });

    it("should have proper field configuration for GraphQL schema", () => {
      const fields = RootQueryType.getFields();

      // Verify all required fields exist
      expect(Object.keys(fields)).toContain("user");
      expect(Object.keys(fields)).toContain("lists");
      expect(Object.keys(fields)).toContain("list");
      expect(Object.keys(fields)).toContain("media");

      // Verify field count
      expect(Object.keys(fields)).toHaveLength(4);
    });
  });
});
