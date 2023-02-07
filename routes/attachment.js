const express = require("express");
const { upload } = require("../config/attachment");
const {
  saveAttachment,
  previewAttachment,
  previewAttachmentInfo,
  previewAttachmentInfoList,
} = require("../controllers/attachment");
const router = express.Router();

// Get All Attachments List API
/**
 * @swagger
 * /api/attachments:
 *  get:
 *    tags: [Attachment]
 *    summary: Get Attachments List
 *    responses:
 *      200:
 *        description: Get successful
 *      404:
 *        description: Not Found
 *
 */
router.route("/").get(previewAttachmentInfoList);

// Get Attachment API
/**
 * @swagger
 * /api/attachments/{id}:
 *  get:
 *    tags: [Attachment]
 *    summary: Get Attachment
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Attachment Id
 *    responses:
 *      200:
 *        description: Get successful
 *      404:
 *        description: Not Found
 *
 */
router.route("/:attachment_id").get(previewAttachment);

// Get Attachment Info API
/**
 * @swagger
 * /api/attachments/info/{id}:
 *  get:
 *    tags: [Attachment]
 *    summary: Get Attachment Info
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: Attachment Id
 *    responses:
 *      200:
 *        description: Get successful
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *
 */
router.route("/info/:attachment_id").get(previewAttachmentInfo);

// Save Attachments API
/**
 * @swagger
 * /api/attachments:
 *  post:
 *    tags: [Attachment]
 *    summary: Upload Attachments
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
router.route("/").post(upload.array("Files[]"), saveAttachment);

module.exports = router;
