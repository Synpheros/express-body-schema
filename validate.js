console.log('## Using express-body-schema version modified by Synpheros');

const SchemaValidationError = require("./SchemaValidationError");

const isDate = value => {

  if (value instanceof Date) {
    return true;
  }

  if (typeof value === "string" && !isNaN(new Date(value).getTime())) {
    return true;
  }

  if (typeof value === "number" && !isNaN(new Date(value).getTime())) {
    return true;
  }

  return false;

};

const isNonEmptyString = value => {

  if (typeof value !== "string") {
    return false;
  }

  return value.trim() !== "";

};

const isEmail = value => {

  if (!isNonEmptyString(value)) {
    return false;
  }

  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(value);

};

module.exports = (json, schema) => {

  if (!json) {
    throw new SchemaValidationError("Invalid json. Cannot validate a schema against an undefined json object");
  }

  if (!schema) {
    throw new SchemaValidationError("Invalid schema. A schema must not be undefined");
  }

  if (!schema.properties) {
    throw new SchemaValidationError("Invalid schema. A schema must define properties.");
  }

  var i;

  if (schema.hasOwnProperty("required")) {

    var l = schema.required.length;

    for (i = 0; i < l; i++) {
      if (!json.hasOwnProperty(schema.required[i])) {
        throw new SchemaValidationError("Invalid json. Field " + schema.required[i] + " is mandatory");
      }
    }
  }

  for (i in schema.properties) {

    if (json.hasOwnProperty(i)) {

      var property = schema.properties[i];
      var type = schema.properties[i].type;
      var value = json[i];

      if (type === "array" && !(Array.isArray(value))) {
        throw new SchemaValidationError("Invalid json. Expected " + i + " to be an Array but got " + typeof value);
      }else{
        return;
      }

      if (type === "number" && isNaN(value)) {
        throw new SchemaValidationError("Invalid json. Expected type of " + i + " to be " + type + " but got " + typeof value);
      }
      if (type === "id") {

        if (typeof value !== "string") {
          throw new SchemaValidationError("Invalid json. Expected type of " + i + " to be " + type + " but got " + typeof value);
        }

        if (value.trim() === "") {
          throw new SchemaValidationError("Invalid json. Expected " + i + " to be an id but got an empty string");
        }

      } else if (type === "email") {

        if (!isEmail(value)) {
          throw new SchemaValidationError("Invalid json. Expected type of " + i + " to be email but got " + typeof value);
        }

      } else if (type === "non-empty-string") {

        if (!isNonEmptyString(value)) {
          throw new SchemaValidationError("Invalid json. Expected type of " + i + " to be date or string but got " + typeof value);
        }

      } else if (type === "date") {

        if (!isDate(value)) {
          throw new SchemaValidationError("Invalid json. Expected type of " + i + " to be date or string but got " + typeof value);
        }

      } else if (type === "dateOrNull") {

        if (!isDate(value) && value !== null) {
          throw new SchemaValidationError("Invalid json. Expected type of " + i + " to be date or string but got " + typeof value);
        }

      } else if (type !== "number" && typeof value !== type) {
        throw new SchemaValidationError("Invalid json. Expected type of " + i + " to be " + type + " but got " + typeof value);
      }

      if (property.enum && property.enum.indexOf(value) === -1) {
        throw new SchemaValidationError("Invalid json. Expected " + i + " to be one of [" + property.enum.join(", ") + "] but got " + value);
      }

    }

  }

};