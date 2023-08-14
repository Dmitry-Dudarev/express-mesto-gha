const EMAIL_DUPLICATION_ERROR_CODE = 409;

class EmailDuplicationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EMAIL_DUPLICATION_ERROR_CODE;
    this.name = 'EmailDuplicationError';
  }
}

module.exports = EmailDuplicationError;
