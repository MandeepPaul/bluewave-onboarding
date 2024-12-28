const { URL_PROTOCOL_REGEX, URL_DOMAIN_REGEX, MAX_ORG_NAME_LENGTH, ORG_NAME_REGEX } = require('./constants.helper');
const { check, body } = require('express-validator');

require('dotenv').config();

const validateServerUrl = (url) => {
  if (url === '') {
    return { valid: true, errors: null };
  }

  const errors = [];

  if (!URL_PROTOCOL_REGEX.test(url)) {
    errors.push("Invalid or missing protocol (must be 'http://' or 'https://').");
  }

  const domainMatch = url.match(URL_DOMAIN_REGEX);
  if (!domainMatch) {
    errors.push("Invalid domain name (must include a valid top-level domain like '.com').");
  } else {
    const domain = domainMatch[1];
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      errors.push(`Malformed domain: '${domain}'.`);
    }
  }

  if (errors.length === 0) {
    return { valid: true, errors: null };
  }

  return { valid: false, errors };
};

const validateSetServerUrl = [
  check('serverUrl')
    .optional({
      values: ['', null, undefined],
    })
    .isString()
    .withMessage('Server URL must be a string')
    .trim()
    .custom((value) => {
      const result = validateServerUrl(value);
      if (result.valid) {
        return true;
      }
      throw new Error(result.errors);
    }),
];

const validateOrganizationName = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required and should be a non-empty string')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ max: MAX_ORG_NAME_LENGTH })
    .withMessage(`Organization name cannot exceed ${MAX_ORG_NAME_LENGTH} characters`)
    .matches(ORG_NAME_REGEX)
    .withMessage('Organization name contains invalid characters'),
];

module.exports = { validateSetServerUrl, validateOrganizationName };
