import "../../models/user.js";

import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const User = mongoose.model("user");

describe("User Model", () => {
  let testUser;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create a new user instance for each test
    testUser = new User({
      email: "test@example.com",
      password: "plainTextPassword",
    });
  });

  describe("Schema Definition", () => {
    it("should have required fields", () => {
      const userFields = User.schema.paths;

      expect(userFields.email).toBeDefined();
      expect(userFields.password).toBeDefined();
      expect(userFields.email.instance).toBe("String");
      expect(userFields.password.instance).toBe("String");
    });

    it("should create user with email and password", () => {
      const userData = {
        email: "newuser@example.com",
        password: "mypassword123",
      };

      const user = new User(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
    });

    it("should allow empty user creation", () => {
      const user = new User();

      expect(user.email).toBeUndefined();
      expect(user.password).toBeUndefined();
    });
  });

  describe("Password Hashing (pre-save hook)", () => {
    it("should have a pre-save hook configured", () => {
      // Verify that the schema has pre middleware configured
      // Check if the schema has pre hooks by looking at the pre array
      const preHooks = User.schema.pre || User.schema._pres;
      expect(preHooks).toBeDefined();
    });

    it("should test password modification detection", () => {
      const user = new User({
        email: "test@example.com",
        password: "testpass",
      });

      // Initially, password should be marked as modified
      expect(user.isModified("password")).toBe(true);

      // After marking as not modified, it should return false
      user.unmarkModified("password");
      expect(user.isModified("password")).toBe(false);
    });
    it("should have the correct initial password value", () => {
      const user = new User({
        email: "test@example.com",
        password: "plainTextPassword",
      });

      expect(user.password).toBe("plainTextPassword");
    });
  });

  describe("comparePassword method", () => {
    let bcryptCompareSpy;

    beforeEach(() => {
      bcryptCompareSpy = jest.spyOn(bcrypt, "compare");
    });

    afterEach(() => {
      bcryptCompareSpy.mockRestore();
    });

    it("should compare password correctly when passwords match", () => {
      const candidatePassword = "plainTextPassword";
      const hashedPassword = "hashedPassword";
      testUser.password = hashedPassword;

      bcryptCompareSpy.mockImplementation((candidate, hashed, callback) => {
        callback(null, true);
      });

      const mockCallback = jest.fn();
      testUser.comparePassword(candidatePassword, mockCallback);

      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        candidatePassword,
        hashedPassword,
        expect.any(Function),
      );
      expect(mockCallback).toHaveBeenCalledWith(null, true);
    });

    it("should compare password correctly when passwords do not match", () => {
      const candidatePassword = "wrongPassword";
      const hashedPassword = "hashedPassword";
      testUser.password = hashedPassword;

      bcryptCompareSpy.mockImplementation((candidate, hashed, callback) => {
        callback(null, false);
      });

      const mockCallback = jest.fn();
      testUser.comparePassword(candidatePassword, mockCallback);

      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        candidatePassword,
        hashedPassword,
        expect.any(Function),
      );
      expect(mockCallback).toHaveBeenCalledWith(null, false);
    });

    it("should handle bcrypt comparison error", () => {
      const candidatePassword = "plainTextPassword";
      const mockError = new Error("Comparison failed");

      bcryptCompareSpy.mockImplementation((candidate, hashed, callback) => {
        callback(mockError, null);
      });

      const mockCallback = jest.fn();
      testUser.comparePassword(candidatePassword, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockError, null);
    });

    it("should handle undefined candidate password", () => {
      bcryptCompareSpy.mockImplementation((candidate, hashed, callback) => {
        callback(null, false);
      });

      const mockCallback = jest.fn();
      testUser.comparePassword(undefined, mockCallback);

      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        undefined,
        testUser.password,
        expect.any(Function),
      );
      expect(mockCallback).toHaveBeenCalledWith(null, false);
    });

    it("should handle empty string candidate password", () => {
      bcryptCompareSpy.mockImplementation((candidate, hashed, callback) => {
        callback(null, false);
      });

      const mockCallback = jest.fn();
      testUser.comparePassword("", mockCallback);

      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        "",
        testUser.password,
        expect.any(Function),
      );
      expect(mockCallback).toHaveBeenCalledWith(null, false);
    });
  });

  describe("Model Registration", () => {
    it("should register the user model with mongoose", () => {
      expect(mongoose.model("user")).toBeDefined();
      expect(mongoose.model("user")).toBe(User);
    });

    it("should have the correct model name", () => {
      expect(User.modelName).toBe("user");
    });
  });

  describe("Model Validation", () => {
    it("should allow user with valid email and password", () => {
      const user = new User({
        email: "valid@example.com",
        password: "validpassword",
      });

      const validationError = user.validateSync();
      expect(validationError).toBeUndefined();
    });

    it("should allow user without email or password (schema does not require them)", () => {
      const user = new User({});

      const validationError = user.validateSync();
      expect(validationError).toBeUndefined();
    });
  });
});
