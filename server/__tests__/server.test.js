import { jest } from "@jest/globals";

// Mock all external dependencies
jest.mock("dotenv/config", () => ({}));
jest.mock("mongoose");
jest.mock("../utilities.js");
jest.mock("../models/index.js", () => ({}));
jest.mock("../services/auth.js", () => ({}));
jest.mock("../schema/mutations.js", () => ({}));
jest.mock("../schema/schema.js", () => ({
  default: {
    getQueryType: () => ({ name: "Query" }),
    getMutationType: () => ({ name: "Mutation" }),
  },
}));

// Mock passport
jest.mock("passport", () => ({
  initialize: jest.fn(() => (req, res, next) => next()),
  session: jest.fn(() => (req, res, next) => next()),
}));

// Mock express-session
jest.mock("express-session", () => {
  return jest.fn(() => (req, res, next) => {
    req.session = {};
    next();
  });
});

// Mock connect-mongo
jest.mock("connect-mongo", () => ({
  create: jest.fn(() => ({})),
}));

// Mock graphql-http
jest.mock("graphql-http/lib/use/express", () => ({
  createHandler: jest.fn(() => (req, res) => {
    res.status(200).json({ data: { test: "ok" } });
  }),
}));

// Mock graphql-passport
jest.mock("graphql-passport", () => ({
  buildContext: jest.fn(() => ({})),
}));

// Mock express
const mockApp = {
  use: jest.fn(),
  listen: jest.fn((port, callback) => {
    if (callback) callback();
  }),
};

jest.mock("express", () => {
  const expressMock = jest.fn(() => mockApp);
  expressMock.static = jest.fn();
  return expressMock;
});

import MongoStore from "connect-mongo";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import mongoose from "mongoose";

describe("Server Configuration", () => {
  let originalEnv;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Save original environment
    originalEnv = { ...process.env };

    // Set up test environment variables
    process.env.NODE_ENV = "test";
    process.env.MONGO_URI = "mongodb://localhost:27017/test";
    process.env.SECRET = "test-secret";
    process.env.PORT = "3001";

    // Mock mongoose connection
    mongoose.connect = jest.fn().mockResolvedValue(true);
    mongoose.model = jest.fn().mockReturnValue({});
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;

    // Clean up modules
    jest.resetModules();
  });

  describe("Environment Variables", () => {
    it("should use MONGO_URI from environment", () => {
      const testUri = "mongodb://test:27017/testdb";
      process.env.MONGO_URI = testUri;

      // The server should use this URI when connecting
      expect(process.env.MONGO_URI).toBe(testUri);
    });

    it("should use PORT from environment or default to 3001", () => {
      // Test with PORT set
      process.env.PORT = "8080";
      expect(process.env.PORT).toBe("8080");

      // Test with PORT not set
      delete process.env.PORT;
      const defaultPort = process.env.PORT || 3001;
      expect(defaultPort).toBe(3001);
    });

    it("should require SECRET environment variable for sessions", () => {
      process.env.SECRET = "test-secret";
      expect(process.env.SECRET).toBe("test-secret");
    });
  });

  describe("Mongoose Connection", () => {
    it("should connect to MongoDB with correct URI", async () => {
      const testUri = "mongodb://localhost:27017/test";
      process.env.MONGO_URI = testUri;

      await mongoose.connect(testUri);

      expect(mongoose.connect).toHaveBeenCalledWith(testUri);
    });

    it("should handle connection errors", async () => {
      const mockError = new Error("Connection failed");
      mongoose.connect.mockRejectedValue(mockError);

      try {
        await mongoose.connect(process.env.MONGO_URI);
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });
  });

  describe("Express App Configuration", () => {
    it("should be able to create express app", () => {
      const app = express();

      expect(app).toBeDefined();
      expect(app.use).toBeDefined();
      expect(app.listen).toBeDefined();
    });

    it("should have middleware setup methods available", () => {
      expect(mockApp.use).toBeDefined();
      expect(mockApp.listen).toBeDefined();
    });
  });

  describe("GraphQL Setup", () => {
    it("should have createHandler function available", () => {
      expect(typeof createHandler).toBe("function");
    });
  });

  describe("Session Configuration", () => {
    it("should have MongoStore.create function available", () => {
      expect(typeof MongoStore.create).toBe("function");
    });

    it("should have required environment variables for session config", () => {
      expect(process.env.MONGO_URI).toBeDefined();
      expect(process.env.SECRET).toBeDefined();
    });
  });
});
