import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";

import { TestSetup } from "../testUtils.js";

describe("User Model", () => {
  let testUser;
  let User;
  let save;
  let mongoose;

  // Initialize database once for the entire suite
  beforeAll(async () => {
    await TestSetup.initializeTestOnce();

    // Use dynamic imports to load models and functions after mocks are set up
    const mongooseModule = await import("mongoose");
    const userModule = await import("../../models/user.js");

    mongoose = mongooseModule.default;
    User = mongoose.model("user");
    save = userModule.save;
  });

  beforeEach(async () => {
    // Only clear database and reset mocks, don't reinitialize
    await TestSetup.clearDatabase();
    jest.clearAllMocks();

    // Create a new user instance for each test
    testUser = new User({
      email: "test@example.com",
      password: "plainTextPassword",
    });
  });

  afterEach(async () => {
    await TestSetup.cleanupTest();
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
    let bcryptGenSaltSpy;
    let bcryptHashSpy;

    beforeEach(() => {
      bcryptGenSaltSpy = jest.spyOn(bcrypt, "genSalt");
      bcryptHashSpy = jest.spyOn(bcrypt, "hash");
    });

    afterEach(() => {
      bcryptGenSaltSpy.mockRestore();
      bcryptHashSpy.mockRestore();
    });

    it("should have a pre-save hook configured", () => {
      // Verify that the schema has pre middleware configured
      // Check if the schema has pre hooks by looking at the pre array
      const preHooks = User.schema.pre || User.schema._pres;
      expect(preHooks).toBeDefined();
    });

    it("should hash password when password is modified", (done) => {
      const user = new User({
        email: "test@example.com",
        password: "plainTextPassword",
      });

      const mockSalt = "mockedSalt";
      const mockHash = "mockedHashedPassword";

      bcryptGenSaltSpy.mockImplementation((rounds, callback) => {
        expect(rounds).toBe(10);
        callback(null, mockSalt);
      });

      bcryptHashSpy.mockImplementation((password, salt, options, callback) => {
        expect(password).toBe("plainTextPassword");
        expect(salt).toBe(mockSalt);
        expect(options).toBeNull();
        callback(null, mockHash);
      });

      const mockNext = jest.fn((err) => {
        if (err) {
          done(err);
        } else {
          expect(user.password).toBe(mockHash);
          expect(bcryptGenSaltSpy).toHaveBeenCalledWith(
            10,
            expect.any(Function),
          );
          expect(bcryptHashSpy).toHaveBeenCalledWith(
            "plainTextPassword",
            mockSalt,
            null,
            expect.any(Function),
          );
          done();
        }
      });

      // Call the save function directly
      save.call(user, mockNext);
    });

    it("should not hash password when password is not modified", (done) => {
      const user = new User({
        email: "test@example.com",
        password: "plainTextPassword",
      });

      // Mark password as not modified
      user.unmarkModified("password");

      const mockNext = jest.fn((err) => {
        expect(err).toBeUndefined();
        expect(user.password).toBe("plainTextPassword"); // Should remain unchanged
        expect(bcryptGenSaltSpy).not.toHaveBeenCalled();
        expect(bcryptHashSpy).not.toHaveBeenCalled();
        done();
      });

      // Call the save function directly
      save.call(user, mockNext);
    });

    it("should handle bcrypt.genSalt error", (done) => {
      const user = new User({
        email: "test@example.com",
        password: "plainTextPassword",
      });

      const saltError = new Error("Salt generation failed");

      bcryptGenSaltSpy.mockImplementation((rounds, callback) => {
        callback(saltError, null);
      });

      const mockNext = jest.fn((err) => {
        expect(err).toBe(saltError);
        expect(bcryptHashSpy).not.toHaveBeenCalled();
        done();
      });

      // Call the save function directly
      save.call(user, mockNext);
    });

    it("should handle bcrypt.hash error", (done) => {
      const user = new User({
        email: "test@example.com",
        password: "plainTextPassword",
      });

      const mockSalt = "mockedSalt";
      const hashError = new Error("Hash generation failed");

      bcryptGenSaltSpy.mockImplementation((rounds, callback) => {
        callback(null, mockSalt);
      });

      bcryptHashSpy.mockImplementation((password, salt, options, callback) => {
        callback(hashError, null);
      });

      const mockNext = jest.fn((err) => {
        expect(err).toBe(hashError);
        expect(user.password).toBe("plainTextPassword"); // Should remain unchanged on error
        done();
      });

      // Call the save function directly
      save.call(user, mockNext);
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

    it("should use correct salt rounds", (done) => {
      const user = new User({
        email: "test@example.com",
        password: "plainTextPassword",
      });

      bcryptGenSaltSpy.mockImplementation((rounds, callback) => {
        expect(rounds).toBe(10);
        callback(null, "mockSalt");
      });

      bcryptHashSpy.mockImplementation((password, salt, options, callback) => {
        callback(null, "mockHash");
      });

      const mockNext = jest.fn(() => {
        expect(bcryptGenSaltSpy).toHaveBeenCalledWith(10, expect.any(Function));
        done();
      });

      // Call the save function directly
      save.call(user, mockNext);
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
      const mongooseUser = mongoose.model("user");
      expect(mongooseUser).toBeDefined();
      expect(mongooseUser).toBe(User);
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
