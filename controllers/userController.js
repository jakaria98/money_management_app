const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const registerValidator = require("../validator/registerValidator");
const loginValidator = require("../validator/loginValidator");
const { serverError, resourceError } = require("../util/error");

module.exports = {
  login(req, res) {
    let { email, password } = req.body;
    let validate = loginValidator({ email, password });

    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    }

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return resourceError(res, "User Not Found");
        }
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return serverError(res, error);
          if (!result) {
            return resourceError(res, " Password Doesn't Match");
          }
          let token = jwt.sign(
            {
              _id: user._id,
              name: user.name,
              email: user.email,
              amount: user.amount,
              income: user.income,
              expense: user.expense,
              transactions: user.transactions,
            },
            "SECRET",
            { expiresIn: 60 * 60 * 2 }
          );
          res.status(200).json({
            message: "Login Successful",
            token: `Bearer ${token}`,
          });
        });
      })
      .catch((error) => serverError(res, error));
  },

  register(req, res) {
    let { name, email, password, confirmPassword } = req.body;
    let validate = registerValidator({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!validate.isValid) {
      return res.status(400).json(validate.error);
    } else {
      User.findOne({ email })
        .then((user) => {
          if (user) {
            return resourceError(res, "email Already Exist");
          }

          bcrypt.hash(password, 11, (err, hash) => {
            if (err) {
              serverError(res, err);
            }
            let user = new User({
              name,
              email,
              password: hash,
              balance: 0,
              expense: 0,
              income: 0,
              transactions: [],
            });
            user
              .save()
              .then((user) => {
                res.status(201).json({
                  message: "user saved",
                  user,
                });
              })
              .catch((error) => {
                serverError(res, error);
              });
          });
        })
        .catch((error) => {
          serverError(res, error);
        });
    }
  },
  allUser(req, res) {
    User.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => serverError(res, error));
  },
};
