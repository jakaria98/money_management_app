const Transaction = require("../model/Transaction");
const { serverError } = require("../util/error");
const User = require("../model/User");

module.exports = {
  create(req, res) {
    let { amount, note, type } = req.body;
    let userId = req.user._id;

    let transaction = new Transaction({
      amount,
      note,
      type,
      author: userId,
    });
    transaction
      .save()
      .then((trans) => {
        let updatedUser = { ...req.user };
        if (type === "income") {
          updatedUser.balance += amount;
          updatedUser.income += amount;
        } else if (type === "expense") {
          updatedUser.balance -= amount;
          updatedUser.expense += amount;
        }
        updatedUser.transactions.unshift(trans._id);
        User.findByIdAndUpdate(
          updatedUser._id,
          { $set: updatedUser },
          { new: true }
        );
        res.status(201).json({
          message: "transaction done",
          ...trans,
        });
      })
      .catch((error) => serverError(res, error));
  },
  getAll(req, res) {
    Transaction.find()
      .then((transactions) => {
        if (transactions.length === 0) {
          res.status(200).json({
            message: "no transaction found",
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
            message: "no transaction found",
          });
        } else {
          res.status(200).json(transaction);
        }
      })
      .catch((error) => serverError(res.error));
  },
  update(req, res) {
    let { transactionId } = req.params;
    Transaction.findByIdAndUpdate(
      { _id: transactionId },
      { $set: req.body },
      { new: true }
    )
      .then((result) => {
        res.status(200).json({
          message: "Updated Successfully",
          ...result,
        });
      })
      .catch((error) => serverError(res, error));
  },
  remove(req, res) {
    let { transactionId } = req.params;
    Transaction.findByIdAndDelete({ _id: transactionId })
      .then((result) => {
        res.status(200).json({
          message: "Deleted Successfully",
          ...result,
        });
      })
      .catch((error) => serverError(res, error));
  },
};
