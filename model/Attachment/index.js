const mongoose = require("mongoose");

var attachmentSchema = new mongoose.Schema(
  {
    mimetype: {
      type: String,
      required: [true, "Please Provide MimeType"], // If Required
      trim: true,
    },
    filename: {
      type: String,
      trim: true,
      required: [true, "Please Provide Filename"], // If Required
    },
    size: {
      type: Number,
      required: [true, "Please Provide Attachment Size"], // If Required
    },
  },
  { timestamps: true }
);

const Attachment = mongoose.model("Attachment", attachmentSchema);
module.exports = Attachment;

/**
 * @swagger
 * components:
 *  schemas:
 *   Attachment:
 *     type: object
 *     required:
 *        - mimetype
 *        - filename
 *        - size
 *     properties:
 *       mimetype:
 *         type: string
 *       filename:
 *         type: string
 *       size:
 *         type: number
 */
