import "dotenv/config";
import "./server/models/index.js";

import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import { createHandler } from "graphql-http/lib/use/express";
import { buildContext } from "graphql-passport";
import mongoose from "mongoose";
import passport from "passport";

import schema from "./server/schema/schema.js";
import { logError, logInfo } from "./server/utilities.js";

// Create a new Express application
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const { MONGO_URI } = process.env;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    logInfo("Connected to MongoDB instance.");

    // Session setup
    app.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET,
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          touchAfter: 24 * 3600, // Reduce database writes by updating sessions only once every 24 hours
        }),
      }),
    );

    // Passport setup
    app.use(passport.initialize());
    app.use(passport.session());

    // GraphQL endpoint setup
    const User = mongoose.model("user");
    app.use(
      "/graphql",
      createHandler({
        schema,
        graphiql: true,
        context: (req) => {
          const context = {
            buildContext: buildContext({ req: req.raw, res: req.res }),
            user: req.raw.user,
            req: req.raw,
            User,
          };

          return context;
        },
      }),
    );

    // Start the server
    app.listen(process.env.PORT || 3001, () => {
      logInfo("Server is running.");
    });
  } catch (error) {
    logError("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
