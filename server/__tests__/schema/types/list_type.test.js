// Import models to register them with mongoose
import "../../../models/index.js";

import { jest } from "@jest/globals";
import graphql from "graphql";

import ListType from "../../../schema/types/list_type.js";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

describe("ListType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Type Definition", () => {
    it("should be a GraphQLObjectType", () => {
      expect(ListType).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(ListType.name).toBe("ListType");
    });

    it("should have the correct fields", () => {
      const fields = ListType.getFields();

      expect(fields.id).toBeDefined();
      expect(fields.name).toBeDefined();
      expect(fields.user).toBeDefined();
      expect(fields.media).toBeDefined();
    });
  });

  describe("Field Types", () => {
    let fields;

    beforeEach(() => {
      fields = ListType.getFields();
    });

    it("should have id field of type GraphQLID", () => {
      expect(fields.id.type).toBe(GraphQLID);
    });

    it("should have name field of type GraphQLString", () => {
      expect(fields.name.type).toBe(GraphQLString);
    });

    it("should have user field of type GraphQLID", () => {
      expect(fields.user.type).toBe(GraphQLID);
    });

    it("should have media field of type GraphQLList", () => {
      expect(fields.media.type).toBeInstanceOf(GraphQLList);
      // Note: We can't easily test the MediaType reference without importing it
      // which would cause circular dependency issues in tests
    });
  });

  describe("Field Resolvers", () => {
    let fields;

    beforeEach(() => {
      fields = ListType.getFields();
    });

    it("should not have a resolver for id field", () => {
      expect(fields.id.resolve).toBeUndefined();
    });

    it("should not have a resolver for name field", () => {
      expect(fields.name.resolve).toBeUndefined();
    });

    it("should not have a resolver for user field", () => {
      expect(fields.user.resolve).toBeUndefined();
    });

    it("should have a resolver for media field", () => {
      expect(fields.media.resolve).toBeDefined();
      expect(typeof fields.media.resolve).toBe("function");
    });
  });

  describe("Integration", () => {
    it("should export ListType as default", () => {
      expect(ListType).toBeDefined();
      expect(ListType.name).toBe("ListType");
    });

    it("should have proper field configuration for GraphQL schema", () => {
      const fields = ListType.getFields();

      // Verify all required fields exist
      expect(Object.keys(fields)).toContain("id");
      expect(Object.keys(fields)).toContain("name");
      expect(Object.keys(fields)).toContain("user");
      expect(Object.keys(fields)).toContain("media");

      // Verify field count
      expect(Object.keys(fields)).toHaveLength(4);
    });
  });
});
