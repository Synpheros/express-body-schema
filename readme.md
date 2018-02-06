# Schema Example

```
const mySchema = {
  "properties": {
    "userId": { "type": "id" },
    "lastName": { "type": "non-empty-string" },
    "firstName": { "type": "string" },
    "email": { "type": "email" },
    "age": { "type": "number" }
  },
  "required": ["userId", "lastName"]
}
```

# Usage with express

```

const validate = require("express-body-schema");

...
router("/my/route/", validate.schema(mySchema));
...

router("/my/route/", (error, req, res, next) => {

  if (error instanceOf SchemaValidationError) {
    //you can handle the error here
  }

});

...

```