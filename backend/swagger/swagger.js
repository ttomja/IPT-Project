const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management System API",
      version: "1.0.0",
      description: "Welcome to the API documentation! This interface allows you to easily view and test all backend routes.",
    },
    servers: [
      {
        url: "/api",
        description: "Current Server"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: <token>"
        }
      }
    }
  },
  apis: [
    require("path").join(__dirname, "../routes/*.js"),
    require("path").join(__dirname, "../app.js")
  ],
};
const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };

