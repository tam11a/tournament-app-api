const express = require("express");
const { register, login, validate, forgetpassword, resetpassword } = require("../controllers/admin");
const { protect, adminProtect } = require("../middleware/auth");
const router = express.Router();

// Register API
/**
 * @swagger
 * /api/auth/admin/register:
 *  post:
 *    tags: [Admin]
 *    summary: Register Admin Account
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Admin'
 *
 *    responses:
 *      201:
 *        description: Account creation successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/register").post( register);


// Login API
/**
 * @swagger
 * /api/auth/admin/login:
 *  post:
 *    tags: [Admin]
 *    summary: Login Admin Account
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
 *                unique: true
 *                pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *                default: admin@email.com
 *              password:
 *                type: string
 *                default: 'hellodev'
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

// Validation API
/**
 * @swagger
 * /api/auth/admin/validate:
 *  get:
 *    tags: [Admin]
 *    summary: Validate Admin Account
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
router.route("/validate").get(adminProtect, protect, validate);
// router.route("/forget-password").post(forgetpassword);
// router.route("/resetpassword").post(resetpassword);

module.exports = router;