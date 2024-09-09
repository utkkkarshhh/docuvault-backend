const Messages = {
    GENERAL: {
      INTERNAL_SERVER: "Internal server error.",
      ERROR_EXECUTING_QUERY: "Error executing query.",
    },
    DATABASE: {
      CONNECTION_REFUSED: "Database connection refused.",
      TABLE_UNAVAILABLE: "Table does not exist.",
    },
    USER: {
      NO_USERS_FOUND: "No users found.",
      NO_USER_FOUND: "No user found.",
      NO_USER_WITH_ID: "No user with this ID exists.",
      USER_DELETED: "User deleted successfully.",
    },
    VALIDATION: {
      NAME_REQUIRED: "Name is required.",
      EMAIL_REQUIRED: "Email is required.",
      NAME_EMAIL_REQUIRED: "Name and Email are required.",
      EMAIL_ALREADY_EXISTS: "Email already exists.",
      MISSING_REQUIRED_FIELDS: "Missing required fields.",
      ONE_FIELD_REQUIRED: "At least one field (name or email) is required to update.",
      ALREADY_EXISTS: "User with this email or username already exists.",
      USER_REGISTERED_SUCCESSFULLY: "User has been registered successfully!",
      INCORRECT_PASSWORD: "Incorrect password.",
      LOGIN_SUCCESSFUL: "Login successfully!",
      LOGOUT_SUCCESSFULLY: "Logged out successfully.",
      INVALID_TOKEN: "Invalid registration token."
    },
    AUTHENTICATION: {
      NO_TOKEN: "Access Denied. No token found!",
      INVALID_TOKEN: "Access Denied. Invalid Token!"
    }
  };
  
  module.exports = Messages;
  