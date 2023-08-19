const { INVALID_OWNERSHIP_ERROR_CODE = 403 } = process.env;

class OwnershipError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_OWNERSHIP_ERROR_CODE;
    this.name = 'OwnershipError';
  }
}

module.exports = OwnershipError;
