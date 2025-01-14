const { body, param } = require('express-validator');
const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const addOrUpdateBannerValidation = [
  body('position').notEmpty().isIn(['top', 'bottom']).withMessage('Position must be top or bottom'),
  body('closeButtonAction')
    .notEmpty()
    .isIn(['no action', 'open url', 'open url in a new tab'])
    .withMessage('Invalid close button action'),
  body('url')
    .optional()
    .custom((value, { req }) => {
      if (!value && ['open url', 'open url in a new tab'].includes(req.body.closeButtonAction)) {
        return false;
      }
      return true;
    })
    .withMessage('URL is required when close button action is set to open URL')
    .custom((value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol);
      } catch {
        return false;
      }
    })
    .withMessage('URL must use HTTP or HTTPS protocol'),
  body('actionUrl')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return value.startsWith('/');
    })
    .withMessage('Relative URL must start with /'),
  body('repetitionType').notEmpty().isIn(['show only once', 'show every visit']).withMessage('Invalid repetition'),
  body('backgroundColor')
    .notEmpty()
    .matches(hexColorPattern)
    .withMessage('Background color must be a valid hex color code'),
  body('fontColor').notEmpty().matches(hexColorPattern).withMessage('Font color must be a valid hex color code'),
];

const deleteOrGetBannerByIdValidation = [param('id').notEmpty().trim().isInt().withMessage('Invalid id')];
const getBannerByUrlValidation = [body('url').notEmpty().isString().withMessage('URL is missing or invalid')];
const validatePosition = (value) => {
  const validPositions = ['top', 'bottom'];
  return validPositions.includes(value.toLowerCase());
};

const validatePositionWrapper = (value) => {
  if (!validatePosition(value)) {
    throw new Error('Invalid position');
  }
};

const validateRelativeUrl = (value, fieldName) => {
  if (!value) return;
  try {
    new URL(value);
  } catch (error) {
    if (value.startsWith('/')) {
      return;
    }
    throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
  }
};

const validateUrl = (value, fieldName) => {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }
  } catch (error) {
    throw new Error(`Invalid URL for ${fieldName}: ${error.message}`);
  }
};

module.exports = {
  getBannerByUrlValidation,
  deleteOrGetBannerByIdValidation,
  addOrUpdateBannerValidation,
  validatePosition,
  validatePositionWrapper,
  validateUrl,
  validateRelativeUrl,
};
