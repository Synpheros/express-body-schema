const chai = require("chai");
const expect = chai.expect;
const validate = require("./validate");
const SchemaValidationError = require("./SchemaValidationError");

describe("Validate schema", function() {

  it("should validate most cases", function() {

    var jsonSchema = {
      "properties": {
        "customerId": {
          "type": "id"
        },
        "firstName": {
          "type": "string"
        },
        "age": {
          "type": "number"
        },
        "cars": {
          "type": "array"
        },
        "eyeColor": {
          "type": "string",
          "enum": ["blue", "brown"]
        },
        "lastName": {
          "type": "string"
        },
        "birthday": {
          "type": "date"
        },
        "email": {
          "type": "email"
        }
      },
      "required": ["firstName"]
    };

    expect(function() {
      validate({
        "firstName": "John",
        "email": "json@"
      }, jsonSchema);
    }).to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John",
        "email": "john@somewhere.com"
      }, jsonSchema);
    }).to.not.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John",
        "birthday": "         "
      }, jsonSchema);
    }).to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John",
        "birthday": "1234567"
      }, jsonSchema);
    }).to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John",
        "birthday": new Date()
      }, jsonSchema);
    }).to.not.throw();

    expect(function() {
      validate({
        "firstName": "John",
        "birthday": new Date().getTime()
      }, jsonSchema);
    }).to.not.throw();

    expect(function() {
      validate({
        "firstName": "John",
        "birthday": new Date().toISOString()
      }, jsonSchema);
    }).to.not.throw();

    expect(function() {
      validate({
        "firstName": "John",
        "customerId": "         "
      }, jsonSchema);
    }).to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John",
        "customerId": 8848
      }, jsonSchema);
    }).to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John",
        "customerId": "12samdKASK21"
      }, jsonSchema);
    }).not.to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John",
        "lastName": 123
      }, jsonSchema);
    }).to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": 123
      }, jsonSchema);
    }).to.throw(SchemaValidationError);

    expect(function() {
      validate({
        "firstName": "John"
      }, jsonSchema);
    }).to.not.throw(Error);

    expect(function() {
      validate({
        "firstName": "John",
        "age": 1
      }, jsonSchema);
    }).to.not.throw(Error);

    expect(function() {
      validate({
        "firstName": "John",
        "age": "one"
      }, jsonSchema);
    }).to.throw(Error);

    expect(function() {
      validate({
        "age": 1
      }, jsonSchema);
    }).to.throw(Error);

    expect(function() {
      validate({
        "firstName": "John",
        "eyeColor": "blue"
      }, jsonSchema);
    }).to.not.throw(Error);

    expect(function() {
      validate({
        "firstName": "John",
        "eyeColor": "yellow"
      }, jsonSchema);
    }).to.throw(Error);

  });

});