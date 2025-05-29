const { checkSchema, validationResult } = require('express-validator');

const allowedKeys = ['street_address', 'city', 'postal_code', 'country'];

const validateAddressSchema = checkSchema({
  street_address: {
    in: ['body'],
    isString: true,
    errorMessage: 'Street address must be a string',
    notEmpty: true,
    trim: true,
  },
  city: {
    in: ['body'],
    isString: true,
    errorMessage: 'City must be a string',
    notEmpty: true,
    trim: true,
  },
  postal_code: {
    in: ['body'],
    isString: true,
    errorMessage: 'Postal code must be a string',
    notEmpty: true,
    trim: true,
  },
  country: {
    in: ['body'],
    isString: true,
    errorMessage: 'Country must be a string',
    notEmpty: true,
    trim: true,
  },
});

const validateAddress = [
  validateAddressSchema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check for extra keys
    const extraKeys = Object.keys(req.body).filter(
      (key) => !allowedKeys.includes(key)
    );
    if (extraKeys.length > 0) {
      return res.status(400).json({
        errors: [
          {
            msg: `Unexpected fields: ${extraKeys.join(', ')}`,
            param: 'body',
            location: 'body',
          },
        ],
      });
    }

    next();
  },
];

module.exports = validateAddress;
