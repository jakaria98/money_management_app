const validator = require("validator");

const validate = (user) => {
  let error = {};
 
  if (!user.email) {
    error.email = "Please Provide Your Email";
  } else if (!validator.isEmail(user.email)) {
    error.email = "Please Provide a Valid Email";
  }
  if (!user.password) {
    error.password = "Please Provide a Password";
  } 
  
  return {
    error,
    isValid: Object.keys(error).length == 0,
  };
};

module.exports = validate;
