const sayingsRouter = require("express").Router();
const Saying = require("../models/saying");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

