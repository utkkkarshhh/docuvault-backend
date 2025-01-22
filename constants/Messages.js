const Messages = {
  GENERAL: {
    INTERNAL_SERVER: "Internal server error.",
    ERROR_EXECUTING_QUERY: "Error executing query.",
  },
  DATABASE: {
    CONNECTION_REFUSED: "Database connection refused.",
    TABLE_UNAVAILABLE: "Table does not exist.",
    DATABASE_ERROR: "Database upload failed!",
  },
  USER: {
    NO_USERS_FOUND: "No users found.",
    NO_USER_FOUND: "No user found.",
    NO_USER_WITH_ID: "No user with this ID exists.",
    USER_UPDATED: "User updated successfully.",
    USER_DELETED: "User deleted successfully.",
  },
  VALIDATION: {
    NAME_REQUIRED: "Name is required.",
    EMAIL_REQUIRED: "Email is required.",
    USERNAME_REQUIRED: "Username is required.",
    IDENTIFIER_REQUIRED: "Identifier(Username or Email) is required.",
    PASSWORD_MISSING: "Password field is missing.",
    EMAIL_OR_USERNAME_REQUIRED: "Email or Username required.",
    EMAIL_OR_USERNAME_NOT_EXISTS: "Email or Username does not exists.",
    EMAIL_AND_USERNAME_REQUIRED: "Email and Username required.",
    NAME_EMAIL_REQUIRED: "Name and Email are required.",
    EMAIL_ALREADY_EXISTS: "Email already exists.",
    MISSING_REQUIRED_FIELDS: "Missing required fields.",
    ONE_FIELD_REQUIRED:
      "At least one field (name or email) is required to update.",
    ALREADY_EXISTS: "User with this email or username already exists.",
    USER_REGISTERED_SUCCESSFULLY: "User has been registered successfully!",
    INCORRECT_PASSWORD: "Incorrect password.",
    LOGIN_SUCCESSFUL: "Login successfully!",
    LOGOUT_SUCCESSFULLY: "Logged out successfully.",
    INVALID_TOKEN: "Invalid registration token.",
    DOCUMENT_ID_FORMAT_OBJECT: "Document id or format object missing."
  },
  AUTHENTICATION: {
    NO_TOKEN: "Access Denied. No token found!",
    INVALID_TOKEN: "Access Denied. Invalid Token!",
  },
  ERROR: {
    CONVERSION_FAILED: "Conversion failed!"
  },
  FIREBASE: {
    SUCCESS: {
      UPLOAD_SUCCESS: "File uploaded successfully",
      DELETED_SUCCESS: "File deleted successfully",
      FETCH_SUCCESS: "Retrieved user documents",
    },
    ERROR: {
      MISSING_FIELDS: "Missing required fields",
      UPLOAD_FAILED: "Failed to upload file",
      USER_NOT_FOUND: "User not found, Upload failed!",
      DELETION_FALIED: "User not found, Deletion failed!",
      UPLOAD_LIMIT: "Oops! You've reached your upload limit!",
      USER_ID_DOES_NOT_MAPS: "Provided user_id does not maps to this document.",
      DOCUMENT_NOT_FOUND: "Document not found!"
    },
  },
};

module.exports = Messages;
