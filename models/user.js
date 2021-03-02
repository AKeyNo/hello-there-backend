const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
    required: true
  },
  firstName: {
    type: String,
    minlength: 1,
    required: true
  },
  lastName: {
    type: String,
    minlength: 1,
    required: true
  },
  passwordHash:  {
    type: String,
    required: true
  },
  email:  {
    type: String,
    required: true
  },
  sayings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Saying",
    },
  ],
  follows: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  aboutMe: String,
  location: String,
  joined: {
    type: Date,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
