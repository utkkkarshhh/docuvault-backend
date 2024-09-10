const Constants = {
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  TABLES: {
    USERS: "users",
  },
  AUTH: {
    SALT_ROUNDS: 10,
  },
  AWS: {
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  },
};

module.exports = Constants;
