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
    }
)
const Games = mongoose.model("Games", gamesSchema);
module.exports = Games;