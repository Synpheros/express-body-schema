class SchemaValidationError extends Error {

  constructor(message) {
    super(message);
  }

}

module.exports = SchemaValidationError;