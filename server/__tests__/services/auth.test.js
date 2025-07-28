import mongoose from "mongoose";
import "../../models/user.js";
import authService from "../../services/auth.js";
import {
  TestData,
  TestPatterns,
  MockFactories,
  ModelMocking,
} from "../testUtils.js";

const User = mongoose.model("user");

describe("Auth Service", () => {
  beforeEach(() => {
    ModelMocking.setupModelMocking(mongoose.model);
  });

  describe("signup validation", () => {
    test("should throw error if email is missing", () => {
      const password = "password123";
      const req = MockFactories.createMockReq();

      expect(() => {
        authService.signup({ password, req });
      }).toThrow("You must provide an email and password.");
    });

    test("should throw error if password is missing", () => {
      const email = "test@example.com";
      const req = MockFactories.createMockReq();

      expect(() => {
        authService.signup({ email, req });
      }).toThrow("You must provide an email and password.");
    });

    test("should throw error if both email and password are missing", () => {
      const req = MockFactories.createMockReq();

      expect(() => {
        authService.signup({ req });
      }).toThrow("You must provide an email and password.");
    });

    test("should handle req.logIn error", async () => {
      const email = "test@example.com";
      const password = "password123";
      const logInError = new Error("Login failed");
      const req = MockFactories.createMockReq(null, logInError);

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
  });

  describe("login", () => {
    test("should successfully log in with valid credentials", async () => {
      const email = "test@example.com";
      const password = "password123";
      const testUser = { email, id: "123" };
      const context = MockFactories.createMockContext({ user: testUser });

      const result = await authService.login({ email, password, context });

      expect(result).toEqual({ user: testUser });
    });

    test("should throw error for invalid credentials (null user)", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";
      const context = MockFactories.createMockContext({ user: null });

      await expect(
        authService.login({ email, password, context }),
      ).rejects.toThrow("Invalid credentials.");
    });

    test("should throw error for invalid credentials (undefined user)", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";
      const context = MockFactories.createMockContext({ user: undefined });

      await expect(
        authService.login({ email, password, context }),
      ).rejects.toThrow("Invalid credentials.");
    });

    test("should handle context.buildContext.login error", async () => {
      const email = "test@example.com";
      const password = "password123";
      const testUser = { email, id: "123" };
      const loginError = new Error("Login context failed");
      const context = MockFactories.createMockContext(
        { user: testUser },
        loginError,
      );

      await expect(
        authService.login({ email, password, context }),
      ).rejects.toThrow("Login context failed");
    });
  });

  describe("logout", () => {
    test("should successfully logout a user", async () => {
      const testUser = { id: "123", email: "test@example.com" };
      const req = MockFactories.createMockReq(testUser);

      const result = await authService.logout(req);

      expect(result).toBe(testUser);
    });

    test("should handle logout error", async () => {
      const testUser = { id: "123", email: "test@example.com" };
      const logoutError = new Error("Logout failed");
      const req = MockFactories.createMockReq(testUser, null, logoutError);

      await expect(authService.logout(req)).rejects.toThrow("Logout failed");
    });

    test("should logout successfully without a user", async () => {
      const req = MockFactories.createMockReq();

      const result = await authService.logout(req);

      expect(result).toBeNull();
    });
  });

  describe("Service Functions", () => {
    test("should export all required functions", () => {
      expect(authService).toBeDefined();
      expect(typeof authService.signup).toBe("function");
      expect(typeof authService.login).toBe("function");
      expect(typeof authService.logout).toBe("function");
    });
  });
});
