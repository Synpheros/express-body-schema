const validate = require("./validate");

exports.schema = schema => {

  return (req, res, next) => {
    validate(req.body, schema);
    next();
  };
  
};