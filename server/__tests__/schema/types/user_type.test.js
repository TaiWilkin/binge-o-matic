// Import models to register them with mongoose
import "../../../models/index.js";

import { jest } from "@jest/globals";
import graphql from "graphql";

import UserType from "../../../schema/types/user_type.js";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

describe("UserType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Type Definition", () => {
    it("should be a GraphQLObjectType", () => {
      expect(UserType).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(UserType.name).toBe("UserType");
    });

    it("should have the correct fields", () => {
      const fields = UserType.getFields();

      expect(fields.id).toBeDefined();
      expect(fields.email).toBeDefined();
      expect(fields.lists).toBeDefined();
    });
  });

  describe("Field Types", () => {
    let fields;

    beforeEach(() => {
      fields = UserType.getFields();
    });

    it("should have id field of type GraphQLID", () => {
      expect(fields.id.type).toBe(GraphQLID);
    });

    it("should have email field of type GraphQLString", () => {
      expect(fields.email.type).toBe(GraphQLString);
    });

    it("should have lists field of type GraphQLList", () => {
      expect(fields.lists.type).toBeInstanceOf(GraphQLList);
      // Note: We can't easily test the ListType reference without importing it
      // which would cause circular dependency issues in tests
    });
  });

  describe("Field Resolvers", () => {
    let fields;

    beforeEach(() => {
      fields = UserType.getFields();
    });

    it("should not have a resolver for id field", () => {
      expect(fields.id.resolve).toBeUndefined();
    });

    it("should not have a resolver for email field", () => {
      expect(fields.email.resolve).toBeUndefined();
    });

    it("should have a resolver for lists field", () => {
      expect(fields.lists.resolve).toBeDefined();
      expect(typeof fields.lists.resolve).toBe("function");
    });
  });

  describe("Integration", () => {
    it("should export UserType as default", () => {
      expect(UserType).toBeDefined();
      expect(UserType.name).toBe("UserType");
    });

    it("should have proper field configuration for GraphQL schema", () => {
      const fields = UserType.getFields();

      // Verify all required fields exist
      expect(Object.keys(fields)).toContain("id");
      expect(Object.keys(fields)).toContain("email");
      expect(Object.keys(fields)).toContain("lists");

      // Verify field count
      expect(Object.keys(fields)).toHaveLength(3);
    });
  });
});
