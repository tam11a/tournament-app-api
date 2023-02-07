const mongoose = require("mongoose");

var gamesSchema = new mongoose.Schema(
    {
        gameName: {
            type: String,
            maxLength: 11,
            trim: true,
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attachment",
            default: null,
        },
        description: {
            type: String,
            required: [true, "Please Provide Description"], // If Required
            trim: true,
        },
        slug: {
            type: String,
            slug: ["gameName"],
            unique: true,
            // permanent: true,
            index: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    { timestamps: true }
)
const Games = mongoose.model("Games", gamesSchema);
module.exports = Games;

/**
 * @swagger
 * components:
 *  schemas:
 *   Games:
 *     type: object
 *     required:
 *        - gameName
 *        - description
 *     properties:
 *       gameName:
 *         type: string
 *       description:
 *         type: string
 *       image:
 *         type: string
 */