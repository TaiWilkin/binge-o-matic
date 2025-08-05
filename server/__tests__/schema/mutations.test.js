import { jest } from "@jest/globals";
import graphql from "graphql";
import GraphQLDate from "graphql-date";

import { TestSetup } from "../testUtils.js";

let mutation;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
} = graphql;

describe("GraphQL Mutations Schema", () => {
  // Initialize database once for the entire suite
  beforeAll(async () => {
    await TestSetup.initializeTestOnce();

    // Import mutation schema dynamically after TestSetup
    const mutationModule = await import("../../schema/mutations.js");
    mutation = mutationModule.default;
  });

  beforeEach(async () => {
    // Only clear database, don't reinitialize
    await TestSetup.clearDatabase();

    // Clear all mock calls before each test
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await TestSetup.cleanupTest();
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

  describe("Basic Structure", () => {
    it("should be a GraphQLObjectType", () => {
      expect(mutation).toBeInstanceOf(GraphQLObjectType);
    });

    it("should have the correct name", () => {
      expect(mutation.name).toBe("Mutation");
    });

    it("should have all expected mutation fields", () => {
      const fields = mutation.getFields();
      const expectedFields = [
        "signup",
        "logout",
        "login",
        "createList",
        "addToList",
        "removeFromList",
        "toggleWatched",
        "hideChildren",
        "addEpisodes",
        "addSeasons",
        "deleteList",
        "editList",
      ];

      expectedFields.forEach((fieldName) => {
        expect(fields[fieldName]).toBeDefined();
      });

      expect(Object.keys(fields)).toHaveLength(12);
    });

    it("should have function resolvers for all mutations", () => {
      const fields = mutation.getFields();
      Object.keys(fields).forEach((fieldName) => {
        expect(typeof fields[fieldName].resolve).toBe("function");
      });
    });
  });

  describe("Auth Mutations Schema", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct signup mutation schema", () => {
      const signup = fields.signup;
      expect(signup.type.name).toBe("UserType");

      const args = argsToObject(signup.args);
      expect(args.email).toBeDefined();
      expect(args.email.type).toBe(GraphQLString);
      expect(args.password).toBeDefined();
      expect(args.password.type).toBe(GraphQLString);
    });

    it("should have correct login mutation schema", () => {
      const login = fields.login;
      expect(login.type.name).toBe("UserType");

      const args = argsToObject(login.args);
      expect(args.email).toBeDefined();
      expect(args.email.type).toBe(GraphQLString);
      expect(args.password).toBeDefined();
      expect(args.password.type).toBe(GraphQLString);
    });

    it("should have correct logout mutation schema", () => {
      const logout = fields.logout;
      expect(logout.type.name).toBe("UserType");
      expect(logout.args).toHaveLength(0);
    });
  });

  describe("List Mutations Schema", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct createList mutation schema", () => {
      const createList = fields.createList;
      expect(createList.type.name).toBe("ListType");

      const args = argsToObject(createList.args);
      expect(args.name).toBeDefined();
      expect(args.name.type).toBe(GraphQLString);
    });

    it("should have correct deleteList mutation schema", () => {
      const deleteList = fields.deleteList;
      expect(deleteList.type.name).toBe("ListType");

      const args = argsToObject(deleteList.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
    });

    it("should have correct editList mutation schema", () => {
      const editList = fields.editList;
      expect(editList.type.name).toBe("ListType");

      const args = argsToObject(editList.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.name).toBeDefined();
      expect(args.name.type).toBe(GraphQLString);
    });
  });

  describe("Media Mutations Schema", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct addToList mutation schema", () => {
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

    it("should have correct removeFromList mutation schema", () => {
      const removeFromList = fields.removeFromList;
      expect(removeFromList.type.name).toBe("ListType");

      const args = argsToObject(removeFromList.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
    });

    it("should have correct toggleWatched mutation schema", () => {
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

    it("should have correct hideChildren mutation schema", () => {
      const hideChildren = fields.hideChildren;
      expect(hideChildren.type.name).toBe("MediaType");

      const args = argsToObject(hideChildren.args);
      expect(args.id).toBeDefined();
      expect(args.id.type).toBe(GraphQLID);
      expect(args.list).toBeDefined();
      expect(args.list.type).toBe(GraphQLID);
    });

    it("should have correct addEpisodes mutation schema", () => {
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

    it("should have correct addSeasons mutation schema", () => {
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

  describe("Return Types", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    it("should have correct return types for auth mutations", () => {
      expect(fields.signup.type.name).toBe("UserType");
      expect(fields.login.type.name).toBe("UserType");
      expect(fields.logout.type.name).toBe("UserType");
    });

    it("should have correct return types for list mutations", () => {
      expect(fields.createList.type.name).toBe("ListType");
      expect(fields.deleteList.type.name).toBe("ListType");
      expect(fields.editList.type.name).toBe("ListType");
    });

    it("should have correct return types for media mutations", () => {
      expect(fields.addToList.type.name).toBe("ListType");
      expect(fields.removeFromList.type.name).toBe("ListType");
      expect(fields.toggleWatched.type.name).toBe("MediaType");
      expect(fields.hideChildren.type.name).toBe("MediaType");
      expect(fields.addEpisodes.type.name).toBe("ListType");
      expect(fields.addSeasons.type.name).toBe("ListType");
    });
  });

  describe("Type Consistency", () => {
    it("should use correct GraphQL types consistently", () => {
      const fields = mutation.getFields();

      // Check that all ID fields use GraphQLID
      const addToListArgs = argsToObject(fields.addToList.args);
      expect(addToListArgs.id.type).toBe(GraphQLID);
      expect(addToListArgs.list.type).toBe(GraphQLID);

      // Check that date fields use GraphQLDate
      expect(addToListArgs.release_date.type).toBe(GraphQLDate);

      // Check that boolean fields use GraphQLBoolean
      const toggleWatchedArgs = argsToObject(fields.toggleWatched.args);
      expect(toggleWatchedArgs.isWatched.type).toBe(GraphQLBoolean);

      // Check that integer fields use GraphQLInt
      const addEpisodesArgs = argsToObject(fields.addEpisodes.args);
      expect(addEpisodesArgs.season_number.type).toBe(GraphQLInt);
    });

    it("should have consistent field structure", () => {
      const fields = mutation.getFields();

      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName];
        expect(field).toHaveProperty("type");
        expect(field).toHaveProperty("args");
        expect(field).toHaveProperty("resolve");
        expect(typeof field.resolve).toBe("function");
      });
    });
  });

  describe("Mutation Resolvers", () => {
    let fields;

    beforeEach(() => {
      fields = mutation.getFields();
    });

    describe("Auth Resolvers", () => {
      describe("signup resolver", () => {
        let authServiceSpy;

        beforeEach(async () => {
          const AuthServiceModule = await import("../../services/auth.js");
          authServiceSpy = jest.spyOn(AuthServiceModule.default, "signup");
        });

        afterEach(() => {
          if (authServiceSpy) {
            authServiceSpy.mockRestore();
          }
        });

        it("should call AuthService.signup with correct arguments", async () => {
          const mockUser = { id: "user123", email: "test@example.com" };
          const args = { email: "test@example.com", password: "password123" };
          const context = { req: { user: null } };

          authServiceSpy.mockResolvedValue(mockUser);

          const result = await fields.signup.resolve(null, args, context);

          expect(authServiceSpy).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
            req: context.req,
          });
          expect(result).toEqual(mockUser);
        });

        it("should handle missing email", async () => {
          const args = { password: "password123" };
          const context = { req: { user: null } };
          const mockError = new Error("Email is required");

          authServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.signup.resolve(null, args, context),
          ).rejects.toThrow("Email is required");
        });

        it("should handle missing password", async () => {
          const args = { email: "test@example.com" };
          const context = { req: { user: null } };
          const mockError = new Error("Password is required");

          authServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.signup.resolve(null, args, context),
          ).rejects.toThrow("Password is required");
        });

        it("should propagate service errors", async () => {
          const args = { email: "test@example.com", password: "password123" };
          const context = { req: { user: null } };
          const mockError = new Error("Email already exists");

          authServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.signup.resolve(null, args, context),
          ).rejects.toThrow("Email already exists");
        });
      });

      describe("login resolver", () => {
        let authServiceSpy;

        beforeEach(async () => {
          const AuthServiceModule = await import("../../services/auth.js");
          authServiceSpy = jest.spyOn(AuthServiceModule.default, "login");
        });

        afterEach(() => {
          if (authServiceSpy) {
            authServiceSpy.mockRestore();
          }
        });

        it("should call AuthService.login and return user", async () => {
          const mockUser = { id: "user123", email: "test@example.com" };
          const args = { email: "test@example.com", password: "password123" };
          const context = { req: { user: null } };

          authServiceSpy.mockResolvedValue({ user: mockUser });

          const result = await fields.login.resolve(null, args, context);

          expect(authServiceSpy).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
            context,
          });
          expect(result).toEqual(mockUser);
        });

        it("should handle invalid credentials", async () => {
          const args = { email: "test@example.com", password: "wrongpassword" };
          const context = { req: { user: null } };
          const mockError = new Error("Invalid credentials");

          authServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.login.resolve(null, args, context),
          ).rejects.toThrow("Invalid credentials");
        });

        it("should handle missing email or password", async () => {
          const args = { email: "", password: "password123" };
          const context = { req: { user: null } };
          const mockError = new Error("Email and password are required");

          authServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.login.resolve(null, args, context),
          ).rejects.toThrow("Email and password are required");
        });
      });

      describe("logout resolver", () => {
        let authServiceSpy;

        beforeEach(async () => {
          const AuthServiceModule = await import("../../services/auth.js");
          authServiceSpy = jest.spyOn(AuthServiceModule.default, "logout");
        });

        afterEach(() => {
          if (authServiceSpy) {
            authServiceSpy.mockRestore();
          }
        });

        it("should call AuthService.logout with req", async () => {
          const mockUser = { id: "user123", email: "test@example.com" };
          const context = { req: { user: mockUser } };

          authServiceSpy.mockResolvedValue(mockUser);

          const result = await fields.logout.resolve(null, {}, context);

          expect(authServiceSpy).toHaveBeenCalledWith(context.req);
          expect(result).toEqual(mockUser);
        });

        it("should handle logout errors", async () => {
          const context = { req: { user: null } };
          const mockError = new Error("Logout failed");

          authServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.logout.resolve(null, {}, context),
          ).rejects.toThrow("Logout failed");
        });

        it("should ignore parentValue and args parameters", async () => {
          const parentValue = { shouldBeIgnored: true };
          const args = { shouldAlsoBeIgnored: "yes" };
          const context = { req: { user: { id: "user123" } } };

          authServiceSpy.mockResolvedValue({ id: "user123" });

          await fields.logout.resolve(parentValue, args, context);

          expect(authServiceSpy).toHaveBeenCalledWith(context.req);
          expect(authServiceSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("List Resolvers", () => {
      describe("createList resolver", () => {
        let listServiceSpy;

        beforeEach(async () => {
          const ListServiceModule = await import("../../services/list.js");
          listServiceSpy = jest.spyOn(ListServiceModule.default, "createList");
        });

        afterEach(() => {
          if (listServiceSpy) {
            listServiceSpy.mockRestore();
          }
        });

        it("should call ListService.createList with correct arguments", async () => {
          const mockList = {
            id: "list123",
            name: "My Movies",
            user: "user123",
          };
          const args = { name: "My Movies" };
          const context = { user: { id: "user123" } };

          listServiceSpy.mockResolvedValue(mockList);

          const result = await fields.createList.resolve(null, args, context);

          expect(listServiceSpy).toHaveBeenCalledWith(
            "My Movies",
            context.user,
          );
          expect(result).toEqual(mockList);
        });

        it("should handle missing list name", async () => {
          const args = { name: "" };
          const context = { user: { id: "user123" } };
          const mockError = new Error("List name is required");

          listServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.createList.resolve(null, args, context),
          ).rejects.toThrow("List name is required");
        });

        it("should handle duplicate list names", async () => {
          const args = { name: "Existing List" };
          const context = { user: { id: "user123" } };
          const mockError = new Error("List name already exists");

          listServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.createList.resolve(null, args, context),
          ).rejects.toThrow("List name already exists");
        });

        it("should handle unauthorized user", async () => {
          const args = { name: "My Movies" };
          const context = { user: null };
          const mockError = new Error("User not authenticated");

          listServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.createList.resolve(null, args, context),
          ).rejects.toThrow("User not authenticated");
        });
      });

      describe("deleteList resolver", () => {
        let listServiceSpy;

        beforeEach(async () => {
          const ListServiceModule = await import("../../services/list.js");
          listServiceSpy = jest.spyOn(ListServiceModule.default, "deleteList");
        });

        afterEach(() => {
          if (listServiceSpy) {
            listServiceSpy.mockRestore();
          }
        });

        it("should call ListService.deleteList with correct arguments", async () => {
          const args = { id: "list123" };
          const context = { user: { id: "user123" } };

          listServiceSpy.mockResolvedValue(null);

          const result = await fields.deleteList.resolve(null, args, context);

          expect(listServiceSpy).toHaveBeenCalledWith(args, context.user);
          expect(result).toBeNull();
        });

        it("should handle non-existent list", async () => {
          const args = { id: "nonexistent" };
          const context = { user: { id: "user123" } };

          listServiceSpy.mockResolvedValue(null);

          const result = await fields.deleteList.resolve(null, args, context);

          expect(result).toBeNull();
        });

        it("should handle unauthorized deletion", async () => {
          const args = { id: "list123" };
          const context = { user: { id: "user456" } };
          const mockError = new Error("Not authorized to delete this list");

          listServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.deleteList.resolve(null, args, context),
          ).rejects.toThrow("Not authorized to delete this list");
        });
      });

      describe("editList resolver", () => {
        let listServiceSpy;

        beforeEach(async () => {
          const ListServiceModule = await import("../../services/list.js");
          listServiceSpy = jest.spyOn(ListServiceModule.default, "editList");
        });

        afterEach(() => {
          if (listServiceSpy) {
            listServiceSpy.mockRestore();
          }
        });

        it("should call ListService.editList with correct arguments", async () => {
          const mockList = {
            id: "list123",
            name: "Updated Movies",
            user: "user123",
          };
          const args = { id: "list123", name: "Updated Movies" };
          const context = { user: { id: "user123" } };

          listServiceSpy.mockResolvedValue(mockList);

          const result = await fields.editList.resolve(null, args, context);

          expect(listServiceSpy).toHaveBeenCalledWith(args, context.user);
          expect(result).toEqual(mockList);
        });

        it("should handle unauthorized edit", async () => {
          const args = { id: "list123", name: "Updated Movies" };
          const context = { user: { id: "user456" } };
          const mockError = new Error("Not authorized to edit this list");

          listServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.editList.resolve(null, args, context),
          ).rejects.toThrow("Not authorized to edit this list");
        });

        it("should handle missing list", async () => {
          const args = { id: "nonexistent", name: "Updated Movies" };
          const context = { user: { id: "user123" } };

          listServiceSpy.mockResolvedValue(null);

          const result = await fields.editList.resolve(null, args, context);

          expect(result).toBeNull();
        });
      });
    });

    describe("Media Resolvers", () => {
      describe("addToList resolver", () => {
        let mediaServiceSpy;

        beforeEach(async () => {
          const MediaServiceModule = await import("../../services/media.js");
          mediaServiceSpy = jest.spyOn(MediaServiceModule.default, "addToList");
        });

        afterEach(() => {
          if (mediaServiceSpy) {
            mediaServiceSpy.mockRestore();
          }
        });

        it("should call MediaService.addToList with correct arguments", async () => {
          const mockList = { id: "list123", name: "My Movies", media: [] };
          const args = {
            id: "movie123",
            title: "The Matrix",
            release_date: "1999-03-31",
            poster_path: "/poster.jpg",
            media_type: "movie",
            list: "list123",
          };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue(mockList);

          const result = await fields.addToList.resolve(null, args, context);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args, context.user);
          expect(result).toEqual(mockList);
        });

        it("should handle unauthorized user", async () => {
          const args = {
            id: "movie123",
            title: "The Matrix",
            list: "list123",
          };
          const context = { user: null };
          const mockError = new Error("User not authenticated");

          mediaServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.addToList.resolve(null, args, context),
          ).rejects.toThrow("User not authenticated");
        });

        it("should handle non-existent list", async () => {
          const args = {
            id: "movie123",
            title: "The Matrix",
            list: "nonexistent",
          };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue(null);

          const result = await fields.addToList.resolve(null, args, context);

          expect(result).toBeNull();
        });
      });

      describe("removeFromList resolver", () => {
        let mediaServiceSpy;

        beforeEach(async () => {
          const MediaServiceModule = await import("../../services/media.js");
          mediaServiceSpy = jest.spyOn(
            MediaServiceModule.default,
            "removeFromList",
          );
        });

        afterEach(() => {
          if (mediaServiceSpy) {
            mediaServiceSpy.mockRestore();
          }
        });

        it("should call MediaService.removeFromList with correct arguments", async () => {
          const mockList = { id: "list123", name: "My Movies", media: [] };
          const args = { id: "movie123", list: "list123" };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue(mockList);

          const result = await fields.removeFromList.resolve(
            null,
            args,
            context,
          );

          expect(mediaServiceSpy).toHaveBeenCalledWith(args, context.user);
          expect(result).toEqual(mockList);
        });

        it("should handle unauthorized user", async () => {
          const args = { id: "movie123", list: "list123" };
          const context = { user: null };
          const mockError = new Error("User not authenticated");

          mediaServiceSpy.mockRejectedValue(mockError);

          await expect(
            fields.removeFromList.resolve(null, args, context),
          ).rejects.toThrow("User not authenticated");
        });

        it("should handle non-existent list or media", async () => {
          const args = { id: "nonexistent", list: "list123" };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue(null);

          const result = await fields.removeFromList.resolve(
            null,
            args,
            context,
          );

          expect(result).toBeNull();
        });
      });

      describe("toggleWatched resolver", () => {
        let mediaServiceSpy;

        beforeEach(async () => {
          const MediaServiceModule = await import("../../services/media.js");
          mediaServiceSpy = jest.spyOn(
            MediaServiceModule.default,
            "toggleWatched",
          );
        });

        afterEach(() => {
          if (mediaServiceSpy) {
            mediaServiceSpy.mockRestore();
          }
        });

        it("should call MediaService.toggleWatched with correct arguments", async () => {
          const mockMedia = {
            id: "movie123",
            title: "The Matrix",
            watched: true,
          };
          const args = { id: "movie123", list: "list123", isWatched: true };

          mediaServiceSpy.mockResolvedValue(mockMedia);

          const result = await fields.toggleWatched.resolve(null, args);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(result).toEqual(mockMedia);
        });

        it("should handle toggle to unwatched", async () => {
          const mockMedia = {
            id: "movie123",
            title: "The Matrix",
            watched: false,
          };
          const args = { id: "movie123", list: "list123", isWatched: false };

          mediaServiceSpy.mockResolvedValue(mockMedia);

          const result = await fields.toggleWatched.resolve(null, args);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(result).toEqual(mockMedia);
        });

        it("should handle non-existent media", async () => {
          const args = { id: "nonexistent", list: "list123", isWatched: true };

          mediaServiceSpy.mockResolvedValue(null);

          const result = await fields.toggleWatched.resolve(null, args);

          expect(result).toBeNull();
        });

        it("should ignore parentValue and context parameters", async () => {
          const parentValue = { shouldBeIgnored: true };
          const args = { id: "movie123", list: "list123", isWatched: true };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue({ id: "movie123", watched: true });

          await fields.toggleWatched.resolve(parentValue, args, context);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(mediaServiceSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("hideChildren resolver", () => {
        let mediaServiceSpy;

        beforeEach(async () => {
          const MediaServiceModule = await import("../../services/media.js");
          mediaServiceSpy = jest.spyOn(
            MediaServiceModule.default,
            "hideChildren",
          );
        });

        afterEach(() => {
          if (mediaServiceSpy) {
            mediaServiceSpy.mockRestore();
          }
        });

        it("should call MediaService.hideChildren with correct arguments", async () => {
          const mockMedia = {
            id: "show123",
            title: "Breaking Bad",
            childrenHidden: true,
          };
          const args = { id: "show123", list: "list123" };

          mediaServiceSpy.mockResolvedValue(mockMedia);

          const result = await fields.hideChildren.resolve(null, args);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(result).toEqual(mockMedia);
        });

        it("should handle non-existent media", async () => {
          const args = { id: "nonexistent", list: "list123" };

          mediaServiceSpy.mockResolvedValue(null);

          const result = await fields.hideChildren.resolve(null, args);

          expect(result).toBeNull();
        });

        it("should ignore parentValue and context parameters", async () => {
          const parentValue = { shouldBeIgnored: true };
          const args = { id: "show123", list: "list123" };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue({
            id: "show123",
            childrenHidden: true,
          });

          await fields.hideChildren.resolve(parentValue, args, context);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(mediaServiceSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("addEpisodes resolver", () => {
        let mediaServiceSpy;

        beforeEach(async () => {
          const MediaServiceModule = await import("../../services/media.js");
          mediaServiceSpy = jest.spyOn(
            MediaServiceModule.default,
            "addEpisodes",
          );
        });

        afterEach(() => {
          if (mediaServiceSpy) {
            mediaServiceSpy.mockRestore();
          }
        });

        it("should call MediaService.addEpisodes with correct arguments", async () => {
          const mockList = { id: "list123", name: "TV Shows", media: [] };
          const args = {
            id: "season123",
            list: "list123",
            season_number: 1,
            show_id: "show123",
          };

          mediaServiceSpy.mockResolvedValue(mockList);

          const result = await fields.addEpisodes.resolve(null, args);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(result).toEqual(mockList);
        });

        it("should handle API errors", async () => {
          const args = {
            id: "season123",
            list: "list123",
            season_number: 1,
            show_id: "show123",
          };
          const mockError = new Error("TMDB API error");

          mediaServiceSpy.mockRejectedValue(mockError);

          await expect(fields.addEpisodes.resolve(null, args)).rejects.toThrow(
            "TMDB API error",
          );
        });

        it("should ignore parentValue and context parameters", async () => {
          const parentValue = { shouldBeIgnored: true };
          const args = {
            id: "season123",
            list: "list123",
            season_number: 1,
            show_id: "show123",
          };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue({ id: "list123", media: [] });

          await fields.addEpisodes.resolve(parentValue, args, context);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(mediaServiceSpy).toHaveBeenCalledTimes(1);
        });
      });

      describe("addSeasons resolver", () => {
        let mediaServiceSpy;

        beforeEach(async () => {
          const MediaServiceModule = await import("../../services/media.js");
          mediaServiceSpy = jest.spyOn(
            MediaServiceModule.default,
            "addSeasons",
          );
        });

        afterEach(() => {
          if (mediaServiceSpy) {
            mediaServiceSpy.mockRestore();
          }
        });

        it("should call MediaService.addSeasons with correct arguments", async () => {
          const mockList = { id: "list123", name: "TV Shows", media: [] };
          const args = {
            id: "show123",
            media_id: "media123",
            list: "list123",
          };

          mediaServiceSpy.mockResolvedValue(mockList);

          const result = await fields.addSeasons.resolve(null, args);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(result).toEqual(mockList);
        });

        it("should handle API errors", async () => {
          const args = {
            id: "show123",
            media_id: "media123",
            list: "list123",
          };
          const mockError = new Error("TMDB API error");

          mediaServiceSpy.mockRejectedValue(mockError);

          await expect(fields.addSeasons.resolve(null, args)).rejects.toThrow(
            "TMDB API error",
          );
        });

        it("should ignore parentValue and context parameters", async () => {
          const parentValue = { shouldBeIgnored: true };
          const args = {
            id: "show123",
            media_id: "media123",
            list: "list123",
          };
          const context = { user: { id: "user123" } };

          mediaServiceSpy.mockResolvedValue({ id: "list123", media: [] });

          await fields.addSeasons.resolve(parentValue, args, context);

          expect(mediaServiceSpy).toHaveBeenCalledWith(args);
          expect(mediaServiceSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
