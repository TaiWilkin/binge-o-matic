import mongoose from "mongoose";
import "../models/user.js";
import authService from "../services/auth.js";

const User = mongoose.model("user");

// Mock request object factory
const createMockReq = (user = null, logInError = null, logoutError = null) => ({
  user,
  logIn: (user, callback) => callback(logInError),
  logout: (callback) => callback(logoutError),
});

// Mock context object factory
const createMockContext = (
  authenticateResult = { user: null },
  loginError = null,
) => ({
  buildContext: {
    authenticate: () => Promise.resolve(authenticateResult),
    login: loginError
      ? () => Promise.reject(loginError)
      : () => Promise.resolve(),
  },
});

describe("Auth Service", () => {
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

      await expect(
        authService.signup({ email, password, req }),
      ).rejects.toThrow("Login failed");
    });
  });

  describe("login", () => {
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

  describe("Service Functions", () => {
    test("should export all required functions", () => {
      expect(authService).toBeDefined();
      expect(typeof authService.signup).toBe("function");
      expect(typeof authService.login).toBe("function");
      expect(typeof authService.logout).toBe("function");
    });
  });
});
