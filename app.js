// config the .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4001;

// Initialize Database
require("./config/database");

// Error Handler MiddleWare
const errorHandler = require("./middleware/error");

// swaggerUI
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// swagger Options
const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: process.env.NAME || "eCommerce API",
			version: "1.0.0",
		},
	},
	// ['app.js', '.routes/*.js']
	apis: ["app.js", "./routes/*.js", "./middleware/*.js", "./model/*/*.js"],
};

app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);

// Use Routes
app.use(express.json());

// Redirect to the Documentation
app.get("/", function (req, res) {
	res.redirect("/doc");
});

// App Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attachments", require("./routes/attachment"));

// Add Swagger UI to Home Page
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

// Authentication
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearer:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

// Middleware Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
