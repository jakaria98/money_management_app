const Transaction = require("../model/Transaction");
const { serverError } = require("../util/error");
const User = require("../model/User");

module.exports = {
  create(req, res) {
    let { amount, note, type } = req.body;
    let userId = req.user._id;

    let transaction = new transaction({ amount, note, type, author: userId });
    transaction
      .save()
      .then((trans) => {
        let updatedUser = { ...req.user };
        if (type === "income") {
          updatedUser.balance = updatedUser.balance + amount;
          updatedUser.income += income;
        } else if (type === "expense") {
          updatedUser.balance -= amount;
          updatedUser.expense += amount;
        }
        updatedUser.transactions.unshift(trans._id);
        User.findOneAndUpdate(
          updatedUser._id,
          { $set: updatedUser },
          { new: true }
        );
        res.status(201).json({
          message: "transaction created successfully",
          ...trans._doc,
          user: result,
        });
      })
      .catch((error) => serverError(res, error));
  },
  getAll(req, res) {
    let { _id } = req.user;
    Transaction.find({ author: _id })
      .then((transactions) => {
        if (transactions.length === 0) {
          res.status(200).json({
            message: "No Transaction Found",
          });
        } else {
          res.status(200).json(transactions);
        }
      })
      .catch((error) => serverError(res, error));
  },
  getSingleTransaction(req, res) {
    let { transactionId } = req.params;
    Transaction.findById(transactionId)
      .then((transaction) => {
        if (!transaction) {
          res.status(200).json({
            message: "No Transaction Found",
          });
        } else {
          res.status(200).json(transaction);
        }
      })
      .catch((error) => serverError(res, error));
  },
  update(req, res) {
    let { transactionId } = req.params;
    Transaction.findOneAndUpdate(
      { _id: transactionId },
      { $set: req.body },
      { new: true }
    )
      .then((result) => {
        res.status(200).json({
          message: "Updated Successfully",
          transaction: result,
        });
      })
      .catch((error) => serverError(res, error));
  },
  remove(req, res) {
    let { transactionId } = req.params;
    Transaction.findOneAndDelete({ _id: transactionId })
      .then((result) => {
        res.status(200).json({
          message: "Deleted Successfully",
          ...result._doc,
        });
      })
      .catch((error) => serverError(res, error));
  },
};
