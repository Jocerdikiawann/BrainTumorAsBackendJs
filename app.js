require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-backend-wasm");

const tumorRouter = require("./routes/tumor");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

tf.enableDebugMode();
tf.setBackend("tensorflow").then(() => {
  app.use(cors());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  app.use("/api/v1", tumorRouter);
});

tf.dispose();

module.exports = app;
