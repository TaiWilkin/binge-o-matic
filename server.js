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

// Replace with your mongoLab URI
const { MONGO_URI } = process.env;

// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = global.Promise;

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose.connect(MONGO_URI);
mongoose.connection
  .once("open", () => logInfo("Connected to MongoLab instance."))
  .on("error", (error) => logError("Error connecting to MongoLab:", error));

// Configures express to use sessions.  This places an encrypted identifier
// on the users cookie.  When a user makes a request, this middleware examines
// the cookie and modifies the request object to indicate which user made the request
// The cookie itself only contains the id of a session; more data about the session
// is stored inside of MongoDB.
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      autoReconnect: true,
    }),
  }),
);

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.  See also servces/auth.js
app.use(passport.initialize());
app.use(passport.session());

// Instruct Express to pass on any request made to the '/graphql' route
// to the GraphQL instance.
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

app.listen(process.env.PORT || 3001, () => {});
