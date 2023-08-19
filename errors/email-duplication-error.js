const { EMAIL_DUPLICATION_ERROR_CODE = 409 } = process.env;

class EmailDuplicationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EMAIL_DUPLICATION_ERROR_CODE;
    this.name = 'EmailDuplicationError';
  }
}

module.exports = EmailDuplicationError;
