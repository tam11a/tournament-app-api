const express = require("express");
const { upload } = require("../config/attachment");
const { createGames, getAll, byID, update, activeInactive, imagesByID, saveImages, delImage } = require('../controllers/Games')
const { query } = require("../middleware/query");
const router = express.Router();


// Get All API
/**
 * @swagger
 * /api/games:
 *  get:
 *    tags: [Games]
 *    summary: Get All games
 *    parameters:
 *      - in: query
 *        name: search
 *        type: string
 *      - in: query
 *        name: limit
 *        type: string
 *      - in: query
 *        name: page
 *        type: string
 *      - in: query
 *        name: isActive
 *        type: string
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").get(query, getAll);


// Games API
/**
 * @swagger
 * /api/games:
 *  post:
 *    tags: [Games]
 *    summary: Created games
 *    security:
 *      - bearer: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Games'
 *
 *    responses:
 *      201:
 *        description: Game created successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/").post(createGames);

// Get Game API
/**
 * @swagger
 * /api/games/{id}:
 *  get:
 *    tags: [Games]
 *    summary: Get Game
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Game Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:games_id").get(byID);

// Update API
/**
 * @swagger
 * /api/games/{id}:
 *  patch:
 *    tags: [Games]
 *    summary: Update Game
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Game Id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              properties:
 *                  gameName:
 *                     type: string
 *                  description:
 *                     type: string
 *
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:games_id").patch(update);

// Update Status API
/**
 * @swagger
 * /api/games/{id}:
 *  put:
 *    tags: [Games]
 *    summary: Toggle Game Status 
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Game Id
 *    responses:
 *      200:
 *        description: Update successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:games_id").put(activeInactive);

// Get Games Images API
/**
 * @swagger
 * /api/games/{id}/images:
 *  get:
 *    tags: [Images]
 *    summary: Get Games Images
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Game Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/:games_id/images").get(imagesByID);

// Save Games Images API
/**
 * @swagger
 * /api/games/{id}/images:
 *  post:
 *    tags: [Images]
 *    summary: Upload Games Images
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Game Id
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - Files[]
 *            properties:
 *              Files[]:
 *                type: array
 *                items:
 *                  type: string
 *                  format: binary
 *
 *    responses:
 *      201:
 *        description: Upload successful
 *      400:
 *        description: Bad Request
 *
 */
router.route("/:games_id/images").post(
    // adminProtect, protect,
    upload.array("Files[]"),
    saveImages
);

// Delete Games Image
/**
 * @swagger
 * /api/games/images/{id}:
 *  delete:
 *    tags: [Images]
 *    summary: Delete Games Image
 *    security:
 *      - bearer: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Game Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/images/:image_id").delete(
    // adminProtect, protect,
    delImage
);

module.exports = router;