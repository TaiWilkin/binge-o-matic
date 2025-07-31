import { GraphQLLocalStrategy } from "graphql-passport";
import mongoose from "mongoose";
import passport from "passport";

const User = mongoose.model("user");

// Serialize the user's ID into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the ID to get the full user object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Local strategy for GraphQL authentication
passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return done(null, false, "Invalid credentials");
      }

      const isMatch = await new Promise((resolve, reject) => {
        user.comparePassword(password, (err, match) => {
          if (err) return reject(err);
          resolve(match);
        });
      });

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, "Invalid credentials.");
      }
    } catch (err) {
      return done(err);
    }
  }),
);

// Signup: creates a user and logs them in
async function signup({ email, password, req }) {
  const newUser = new User({ email, password });

  if (!email || !password) {
    throw new Error("You must provide an email and password.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email in use");
    }

    const user = await newUser.save();

    return new Promise((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  } catch (error) {
    throw error;
  }
}

// Login using the local GraphQL strategy
async function login({ email, password, context }) {
  if (!email || !password) {
    throw new Error("You must provide an email and password.");
  }

  const { user } = await context.buildContext.authenticate("graphql-local", {
    email,
    password,
  });

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  await context.buildContext.login(user);
  return { user };
}

// Logout the current user
async function logout(req) {
  const { user } = req;

  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

export default { signup, login, logout };
