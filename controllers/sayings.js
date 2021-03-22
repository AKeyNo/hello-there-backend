const sayingsRouter = require("express").Router();
const Saying = require("../models/saying");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

sayingsRouter.get("/", async (request, response) => {
  const sayings = await Saying.find({}).populate("user", {
    username: 1,
    firstName: 1,
    lastName: 1,
  });
  response.json(sayings.map((saying) => saying.toJSON()));
});

sayingsRouter.get("/:id", async (request, response, next) => {
  const saying = await Saying.findById(request.params.id);
  if (saying) {
    response.json(saying.toJSON());
  } else {
    response.status(404).end();
  }
});

sayingsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token is missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const saying = new Saying({
    content: body.content,
    time: new Date(),
    user: user._id,
  });

  const savedSaying = await saying.save();
  user.sayings = user.sayings.concat(savedSaying._id);
  await user.save();
  response.json(savedSaying);
});

sayingsRouter.delete("/:id", async (request, response) => {
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response
      .status(401)
      .json({ error: "missing or invalid token needed to delete a saying" });
  }

  const sayingToDelete = await Saying.findById(request.params.id);

  if (sayingToDelete.user.toString() === decodedToken.id) {
    await Saying.findByIdAndDelete(sayingToDelete._id);
    response.status(204).end();
  } else {
    return response.status(401).json({
      error:
        "you are not allowed to delete this post because you aren't the author",
    });
  }
});

module.exports = sayingsRouter;
