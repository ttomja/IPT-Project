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
  },
  apis: [require("path").join(__dirname, "../routes/*.js")],
};
const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };
