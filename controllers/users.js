const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;
  console.log("attempting account creation for", request.body.username);

  if (body.username.length <= 3 || body.password.length <= 3) {
    return response.status(400).json({
      error: "username and password must have 4 or more characters",
    });
  }

  if (await User.findOne({ username: body.username })) {
    return response.status(400).json({
      error: "that username is not unique, it has been taken already",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    passwordHash,
    aboutMe: `Welcome to ${body.username}'s profile!`,
    location: "",
    joined: new Date(),
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("sayings", {
    content: 1,
    time: 1,
  });
  response.json(users.map((user) => user.toJSON()));
});

// returns the user's public information
usersRouter.get("/info/:username", async (request, response) => {
  const user = await User.findOne({ username: request.params.username });

  if (user) {
    response.json({ aboutMe: user.aboutMe, joined: user.joined});
  } else {
    return response.status(404).json({ error: "no user found..." });
  }
});

module.exports = usersRouter;
