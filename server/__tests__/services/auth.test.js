import "../../models/user.js";

import mongoose from "mongoose";
import passport from "passport";

import {
  createMockContext,
  createMockReq,
  setupMockFactories,
} from "../testUtils.js";

// Import service after mocking
const authService = await import("../../services/auth.js").then(
  (m) => m.default,
);

const User = mongoose.model("user");

describe("Auth Service", () => {
  beforeEach(() => {
    setupMockFactories(mongoose.model);
  });

  describe("signup validation", () => {
    test("should throw error if email is missing", async () => {
      const password = "password123";
      const req = createMockReq();

      await expect(authService.signup({ password, req })).rejects.toThrow(
        "You must provide an email and password.",
      );
    });

    test("should throw error if password is missing", async () => {
      const email = "test@example.com";
      const req = createMockReq();

      await expect(authService.signup({ email, req })).rejects.toThrow(
        "You must provide an email and password.",
      );
    });

    test("should throw error if both email and password are missing", async () => {
      const req = createMockReq();

      await expect(authService.signup({ req })).rejects.toThrow(
        "You must provide an email and password.",
      );
    });

    test("should handle req.logIn error", async () => {
      const email = "test@example.com";
      const password = "password123";
      const logInError = new Error("Login failed");
      const req = createMockReq(null, logInError);

      // Mock User.findOne to return null (no existing user)
      const originalFindOne = User.findOne;
      User.findOne = () => Promise.resolve(null);

      // Mock User.prototype.save to return a user object
      const originalSave = User.prototype.save;
      User.prototype.save = function () {
        return Promise.resolve(this);
      };

      try {
        await expect(
          authService.signup({ email, password, req }),
        ).rejects.toThrow("Login failed");
      } finally {
        // Restore original methods
        User.findOne = originalFindOne;
        User.prototype.save = originalSave;
      }
    });

    test("should successfully signup and resolve with user when req.logIn succeeds", async () => {
      const email = "newuser@example.com";
      const password = "password123";
      const req = createMockReq(); // No logInError = success
      const savedUser = { id: "new-user-id", email, password };

      // Mock User.findOne to return null (no existing user)
      const originalFindOne = User.findOne;
      User.findOne = () => Promise.resolve(null);

      // Mock User.prototype.save to return a user object
      const originalSave = User.prototype.save;
      User.prototype.save = function () {
        return Promise.resolve(savedUser);
      };

      try {
        const result = await authService.signup({ email, password, req });
        expect(result).toEqual(savedUser);
      } finally {
        // Restore original methods
        User.findOne = originalFindOne;
        User.prototype.save = originalSave;
      }
    });

    test("should throw error if email already exists", async () => {
      const email = "existing@example.com";
      const password = "password123";
      const req = createMockReq();
      const existingUser = { email, id: "123" };

      // Mock User.findOne to return an existing user
      const originalFindOne = User.findOne;
      User.findOne = () => Promise.resolve(existingUser);

      try {
        await expect(
          authService.signup({ email, password, req }),
        ).rejects.toThrow("Email in use");
      } finally {
        // Restore original method
        User.findOne = originalFindOne;
      }
    });
  });

  describe("login", () => {
    test("should throw error if email is missing", async () => {
      const password = "password123";
      const context = createMockContext();

      await expect(authService.login({ password, context })).rejects.toThrow(
        "You must provide an email and password.",
      );
    });

    test("should throw error if password is missing", async () => {
      const email = "test@example.com";
      const context = createMockContext();

      await expect(authService.login({ email, context })).rejects.toThrow(
        "You must provide an email and password.",
      );
    });

    test("should throw error if both email and password are missing", async () => {
      const context = createMockContext();

      await expect(authService.login({ context })).rejects.toThrow(
        "You must provide an email and password.",
      );
    });

    test("should successfully log in with valid credentials", async () => {
      const email = "test@example.com";
      const password = "password123";
      const testUser = { email, id: "123" };
      const context = createMockContext({ user: testUser });

      const result = await authService.login({ email, password, context });

      expect(result).toEqual({ user: testUser });
    });

    test("should throw error for invalid credentials (null user)", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";
      const context = createMockContext({ user: null });

      await expect(
        authService.login({ email, password, context }),
      ).rejects.toThrow("Invalid credentials.");
    });

    test("should throw error for invalid credentials (undefined user)", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";
      const context = createMockContext({ user: undefined });

      await expect(
        authService.login({ email, password, context }),
      ).rejects.toThrow("Invalid credentials.");
    });

    test("should handle context.buildContext.login error", async () => {
      const email = "test@example.com";
      const password = "password123";
      const testUser = { email, id: "123" };
      const loginError = new Error("Login context failed");
      const context = createMockContext({ user: testUser }, loginError);

      await expect(
        authService.login({ email, password, context }),
      ).rejects.toThrow("Login context failed");
    });
  });

  describe("logout", () => {
    test("should successfully logout a user", async () => {
      const testUser = { id: "123", email: "test@example.com" };
      const req = createMockReq(testUser);

      const result = await authService.logout(req);

      expect(result).toBe(testUser);
    });

    test("should handle logout error", async () => {
      const testUser = { id: "123", email: "test@example.com" };
      const logoutError = new Error("Logout failed");
      const req = createMockReq(testUser, null, logoutError);

      await expect(authService.logout(req)).rejects.toThrow("Logout failed");
    });

    test("should logout successfully without a user", async () => {
      const req = createMockReq();

      const result = await authService.logout(req);

      expect(result).toBeNull();
    });
  });

  describe("Passport Configuration", () => {
    describe("serializeUser", () => {
      test("should call done with user.id", () => {
        const mockUser = { id: "123", email: "test@example.com" };
        const mockDone = jest.fn();

        // Get the serialize function that was registered with passport
        const serializeFunction = passport._serializers[0];

        // Call the serialize function
        serializeFunction(mockUser, mockDone);

        // Verify done was called with correct parameters
        expect(mockDone).toHaveBeenCalledWith(null, mockUser.id);
        expect(mockDone).toHaveBeenCalledTimes(1);
      });

      test("should handle user with different id property", () => {
        const mockUser = { id: "456", email: "another@example.com" };
        const mockDone = jest.fn();

        const serializeFunction = passport._serializers[0];
        serializeFunction(mockUser, mockDone);

        expect(mockDone).toHaveBeenCalledWith(null, "456");
      });
    });

    describe("deserializeUser", () => {
      test("should call done with user when found", async () => {
        const mockUser = { id: "123", email: "test@example.com" };
        const mockDone = jest.fn();

        // Mock User.findById
        const originalFindById = User.findById;
        User.findById = jest.fn().mockResolvedValue(mockUser);

        try {
          const deserializeFunction = passport._deserializers[0];
          await deserializeFunction("123", mockDone);

          expect(User.findById).toHaveBeenCalledWith("123");
          expect(mockDone).toHaveBeenCalledWith(null, mockUser);
          expect(mockDone).toHaveBeenCalledTimes(1);
        } finally {
          User.findById = originalFindById;
        }
      });

      test("should call done with error when database error occurs", async () => {
        const mockError = new Error("Database error");
        const mockDone = jest.fn();

        // Mock User.findById to throw error
        const originalFindById = User.findById;
        User.findById = jest.fn().mockRejectedValue(mockError);

        try {
          const deserializeFunction = passport._deserializers[0];
          await deserializeFunction("123", mockDone);

          expect(User.findById).toHaveBeenCalledWith("123");
          expect(mockDone).toHaveBeenCalledWith(mockError);
          expect(mockDone).toHaveBeenCalledTimes(1);
        } finally {
          User.findById = originalFindById;
        }
      });
    });
  });

  describe("authenticateUser", () => {
    test("should call done with user when credentials are valid", async () => {
      const email = "test@example.com";
      const password = "correctpassword";
      const mockUser = {
        id: "123",
        email: email.toLowerCase(),
        comparePassword: jest.fn(),
      };
      const mockDone = jest.fn();

      // Mock User.findOne to return a user
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      // Mock comparePassword to call callback with success
      mockUser.comparePassword.mockImplementation((pwd, callback) => {
        callback(null, true);
      });

      try {
        await authService.authenticateUser(email, password, mockDone);

        expect(User.findOne).toHaveBeenCalledWith({
          email: email.toLowerCase(),
        });
        expect(mockUser.comparePassword).toHaveBeenCalledWith(
          password,
          expect.any(Function),
        );
        expect(mockDone).toHaveBeenCalledWith(null, mockUser);
        expect(mockDone).toHaveBeenCalledTimes(1);
      } finally {
        User.findOne = originalFindOne;
      }
    });

    test("should call done with false when user not found", async () => {
      const email = "nonexistent@example.com";
      const password = "password";
      const mockDone = jest.fn();

      // Mock User.findOne to return null
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockResolvedValue(null);

      try {
        await authService.authenticateUser(email, password, mockDone);

        expect(User.findOne).toHaveBeenCalledWith({
          email: email.toLowerCase(),
        });
        expect(mockDone).toHaveBeenCalledWith(
          null,
          false,
          "Invalid credentials",
        );
        expect(mockDone).toHaveBeenCalledTimes(1);
      } finally {
        User.findOne = originalFindOne;
      }
    });

    test("should call done with false when password is incorrect", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";
      const mockUser = {
        id: "123",
        email: email.toLowerCase(),
        comparePassword: jest.fn(),
      };
      const mockDone = jest.fn();

      // Mock User.findOne to return a user
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      // Mock comparePassword to call callback with failure
      mockUser.comparePassword.mockImplementation((pwd, callback) => {
        callback(null, false);
      });

      try {
        await authService.authenticateUser(email, password, mockDone);

        expect(User.findOne).toHaveBeenCalledWith({
          email: email.toLowerCase(),
        });
        expect(mockUser.comparePassword).toHaveBeenCalledWith(
          password,
          expect.any(Function),
        );
        expect(mockDone).toHaveBeenCalledWith(
          null,
          false,
          "Invalid credentials.",
        );
        expect(mockDone).toHaveBeenCalledTimes(1);
      } finally {
        User.findOne = originalFindOne;
      }
    });

    test("should call done with error when comparePassword fails", async () => {
      const email = "test@example.com";
      const password = "password";
      const mockUser = {
        id: "123",
        email: email.toLowerCase(),
        comparePassword: jest.fn(),
      };
      const mockDone = jest.fn();
      const compareError = new Error("Password comparison failed");

      // Mock User.findOne to return a user
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      // Mock comparePassword to call callback with error
      mockUser.comparePassword.mockImplementation((pwd, callback) => {
        callback(compareError, null);
      });

      try {
        await authService.authenticateUser(email, password, mockDone);

        expect(User.findOne).toHaveBeenCalledWith({
          email: email.toLowerCase(),
        });
        expect(mockUser.comparePassword).toHaveBeenCalledWith(
          password,
          expect.any(Function),
        );
        expect(mockDone).toHaveBeenCalledWith(compareError);
        expect(mockDone).toHaveBeenCalledTimes(1);
      } finally {
        User.findOne = originalFindOne;
      }
    });

    test("should call done with error when database query fails", async () => {
      const email = "test@example.com";
      const password = "password";
      const mockDone = jest.fn();
      const dbError = new Error("Database connection failed");

      // Mock User.findOne to throw error
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockRejectedValue(dbError);

      try {
        await authService.authenticateUser(email, password, mockDone);

        expect(User.findOne).toHaveBeenCalledWith({
          email: email.toLowerCase(),
        });
        expect(mockDone).toHaveBeenCalledWith(dbError);
        expect(mockDone).toHaveBeenCalledTimes(1);
      } finally {
        User.findOne = originalFindOne;
      }
    });

    test("should convert email to lowercase", async () => {
      const email = "TEST@EXAMPLE.COM";
      const password = "password";
      const mockDone = jest.fn();

      // Mock User.findOne to return null
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockResolvedValue(null);

      try {
        await authService.authenticateUser(email, password, mockDone);

        expect(User.findOne).toHaveBeenCalledWith({
          email: "test@example.com",
        });
        expect(mockDone).toHaveBeenCalledWith(
          null,
          false,
          "Invalid credentials",
        );
      } finally {
        User.findOne = originalFindOne;
      }
    });
  });

  describe("Service Functions", () => {
    test("should export all required functions", () => {
      expect(authService).toBeDefined();
      expect(typeof authService.signup).toBe("function");
      expect(typeof authService.login).toBe("function");
      expect(typeof authService.logout).toBe("function");
      expect(typeof authService.authenticateUser).toBe("function");
    });
  });
});
