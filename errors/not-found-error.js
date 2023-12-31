const { NOT_FOUND_ERROR_CODE = 404 } = process.env;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR_CODE;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
