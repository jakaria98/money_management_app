const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();
app.use(morgan("dev"));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./passport')(passport)

app.use("/api/users", require("./routers/userRouter"));
app.use("/api/transactions", require("./routers/transactionRoute"));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Money Management APP",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  mongoose.connect(
    "mongodb://localhost/money-management-app",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("database connected");
    }
  );
});
