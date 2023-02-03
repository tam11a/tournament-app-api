const express = require("express");
const { register, verify, validate, login } = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    tags: [Authentication]
 *    summary: Register User Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/register").post(register);

// Verify User API
/**
 * @swagger
 * /api/auth/verify:
 *  post:
 *    tags: [Authentication]
 *    summary: Verify User Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - token
 *              - otp
 *            properties:
 *              token:
 *                type: string
 *              otp:
 *                type: string
 *    responses:
 *      200:
 *        description: Authorized
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: No OTP Request Found
 *
 */
router.route("/verify").post(verify);

// Validation API
/**
 * @swagger
 * /api/auth/validate:
 *  get:
 *    tags: [Authentication]
 *    summary: Validate User Account
 *    security:
 *      - bearer: []
 *    responses:
 *      200:
 *        description: Authorized
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: No User Found
 *
 */
router.route("/validate").get(protect, validate);

// Login API
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    tags: [Authentication]
 *    summary: Login User Account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *                default: example@email.com
 *              password:
 *                type: string
 *
 *    responses:
 *      200:
 *        description: Login successful
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Invalid Credentials
 *
 */
router.route("/login").post(login);

module.exports = router;
