class ApiError extends Error {
  constructor(code, message) {
    super();
    this.name = "ApiError";
    this.code = code;
    this.message = message;
  }

  static maskedError(msg) {
    return new ApiError(200, msg);
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static notFound(msg) {
    return new ApiError(404, msg);
  }

  static unauthenticated(msg) {
    return new ApiError(401, msg);
  }

  static unauthorized(msg) {
    return new ApiError(403, msg);
  }

  static tooManyRequests(msg) {
    return new ApiError(429, msg);
  }

  static internalServerError(msg) {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
