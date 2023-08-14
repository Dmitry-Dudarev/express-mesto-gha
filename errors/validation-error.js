const VALIDATION_ERROR_CODE = 400;

class ValidationError extends Error {
  constructor(message, kind) {
    super(message, kind);
    this.statusCode = VALIDATION_ERROR_CODE;
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
