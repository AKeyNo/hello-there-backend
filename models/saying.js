const mongoose = require("mongoose");

const sayingSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  content: {
    type: Date(),
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Saying", sayingSchema);
