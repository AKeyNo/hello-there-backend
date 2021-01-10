const config = require("./utils/config")
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;
const mongoose = require("mongoose");
app.use(cors());

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log("connected to MongoDB");
})
.catch((error) => {
    console.log("error: could not connect to MongoDB")
});

const connection = mongoose.connection;

app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});