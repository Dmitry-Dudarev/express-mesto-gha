const { LOGIN_ERROR_CODE = 401 } = process.env;

class LoginError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = LOGIN_ERROR_CODE;
    this.name = 'LoginError';
  }
}

module.exports = LoginError;
