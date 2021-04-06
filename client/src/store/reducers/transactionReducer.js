import * as Types from "../actions/types";

const transactionReducer = (state = [], action) => {
  switch (action.type) {
    case Types.LOAD_TRANSACTIONS: {
      return action.payload.transactions;
    }
    case Types.CREATE_TRANSACTION: {
      let transaction = [...state];
      transaction.unshift(action.payload.transaction);
      return transaction;
    }
    case Types.REMOVE_TRANSACTION: {
      let transactions = [...state];
      return transactions.filter((tran) => {
        return tran._id !== action.payload.id;
      });
    }
    case Types.UPDATE_TRANSACTION: {
      let transactions = [...state];
      return transactions.map((tran) => {
        if (tran._id === action.payload.transaction._id) {
          return action.payload.transaction;
        }
        return tran;
      });
    }
    default:
      return state;
  }
};

export default transactionReducer;
