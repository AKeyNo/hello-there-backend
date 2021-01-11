const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const loginRouter = require("./controllers/login");
//const sayingsRouter = require("./controllers/sayings");
const usersRouter = require("./controllers/users");
const mongoose = require("mongoose");
const http = require("http");

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error: could not connect to MongoDB");
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use("/api/login", loginRouter);
//app.use("/api/sayings", sayingsRouter);
app.use("/api/users", usersRouter);

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log("Server is running on Port: " + config.PORT);
});
