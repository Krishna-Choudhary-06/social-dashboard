class ApiError extends Error {
  constructor(statusCode, message, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

module.exports = ApiError;
