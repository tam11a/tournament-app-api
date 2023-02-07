const mongoose = require("mongoose");

var gamesImageSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      required: [true, "Please Provide games Image"], // If Required
      default: null,
    },
    games: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Games",
      required: [true, "Please Provide games Id"],
    },
  },
  { timestamps: true }
);

const gamesImage = mongoose.model("GamesImage", gamesImageSchema);
module.exports = gamesImage;

/**
 * @swagger
 * components:
 *  schemas:
 *   GamesImage:
 *     type: object
 *     required:
 *        - image
 *     properties:
 *       image:
 *         type: string
 *         description: Attachment Id
 *       games:
 *         type: string
 *         description: Game Id
 */
