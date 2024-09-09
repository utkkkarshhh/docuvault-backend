const dotenv = require("dotenv");
const swaggerJsDoc = require("swagger-jsdoc");

dotenv.config();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "RESTful APIs",
    version: "2.0.0",
    description: "APIs for Docuvault",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          user_id: {
            type: "integer",
            description: "User ID",
          },
          name: {
            type: "string",
            description: "User's name",
          },
          email: {
            type: "string",
            description: "User's email",
          },
          created_at: {
            type: "string",
            format: "date-time",
            description: "User creation timestamp",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            description: "User last update timestamp",
          },
        },
        required: ["user_id", "name", "email"],
      },
      UserUpdate: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "User's name",
          },
          email: {
            type: "string",
            description: "User's email",
          },
        },
        required: ["name", "email"],
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
          },
        },
        required: ["error"],
      },
      Success: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Success message",
          },
        },
        required: ["message"],
      },
    },
  },
  security: [
    {
      BearerAuth: [], 
    },
  ],
};


const options = {
  definition: swaggerDefinition,
  apis: ["./routes/authRouter/*.js", "./routes/userRouter/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;