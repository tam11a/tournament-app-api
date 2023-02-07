const { default: mongoose } = require("mongoose");
const Attachment = require("../../model/Attachment");
const Games = require("../../model/Games");
const gamesImage = require("../../model/GamesImage");
const ErrorResponse = require("../../utils/errorResponse");
const { queryObjectBuilder, fieldsQuery } = require("../../utils/fieldsQuery");


exports.createGames = async (req, res, next) => {
    // Get Values
    const { gameName, image, description } = req.body;

    try {
        // Store image to DB
        const user = await image.create({
            gameName,
            description,
            image
        });

        res.status(201).json({
            success: true,
            message: "image created successfully",
            data: user,
        })

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.getAll = async (req, res, next) => {
    const { isActive } = req.query;
    try {
        res.status(200).json({
            success: true,
            message: "Game list fetched successfully",
            ...(await Games.paginate(
                {
                    ...(req.search && {
                        $or: [
                            ...queryObjectBuilder(
                                req.search,
                                ["gameName", "slug"],
                                true
                            ),
                        ],
                    }),
                    ...fieldsQuery({
                        isActive,
                    }),
                },
                {
                    ...req.pagination,
                    customLabels: {
                        docs: "data",
                        totalDocs: "total",
                    },
                }
            )),
        });

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.byID = async (req, res, next) => {
    // Get Values
    const { games_id } = req.params;

    // mongoose.Types.ObjectId.isValid(id)
    if (!games_id || !mongoose.Types.ObjectId.isValid(games_id))
        return next(new ErrorResponse("Please provide valid game id", 400));

    try {
        const game = await Games.findById(games_id).populate(
            "gameName"
        );

        if (!game) return next(new ErrorResponse("No game found", 404));

        res.status(200).json({
            success: true,
            data: game,
        });

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.update = async (req, res, next) => {
    // Get Values
    const { games_id } = req.params;

    if (!games_id || !mongoose.Types.ObjectId.isValid(games_id))
        return next(new ErrorResponse("Please provide valid game id", 400));

    const { gameName, description } = req.body;

    try {
        // Update game to DB
        const game = await Games.findByIdAndUpdate(
            games_id,
            {
                gameName,
                description,
            },
            {
                new: true,
            }
        );

        if (gameName) {
            game.gameName = gameName;
            game.save();
        }

        if (game)
            res.status(200).json({
                success: true,
                message: "game updated successfully",
                // data: game,
            });
        else return next(new ErrorResponse("game not found", 404));

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};


exports.activeInactive = async (req, res, next) => {
    // Get Values
    const { games_id } = req.params;

    if (!games_id || !mongoose.Types.ObjectId.isValid(games_id))
        return next(new ErrorResponse("Please provide valid image id", 400));

    try {
        // Update image to DB
        const game = await Games.findById(games_id);

        if (!game) return next(new ErrorResponse("No image found", 404));

        await game.updateOne({
            isActive: !game.isActive,
        });
        await game.save();

        res.status(200).json({
            success: true,
            message: `image ${game.isActive ? "deactivated" : "activated"
                } successfully`,
        });

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.imagesByID = async (req, res, next) => {
    // Get Values
    const { games_id } = req.params;

    // mongoose.Types.ObjectId.isValid(id)
    if (!games_id || !mongoose.Types.ObjectId.isValid(games_id))
        return next(new ErrorResponse("Please provide valid game id", 400));

    try {
        res.status(200).json({
            success: true,
            data: await gamesImage.find({
                games: games_id,
            }).select("-games"),
        });

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.saveImages = async (req, res, next) => {
    // Get Values
    const { games_id } = req.params;

    // mongoose.Types.ObjectId.isValid(id)
    if (!games_id || !mongoose.Types.ObjectId.isValid(games_id))
        return next(new ErrorResponse("Please provide valid category id", 400));

    let attachmentList = req.files
        ? req.files.map((file) => {
            return {
                mimetype: file.mimetype,
                filename: file.filename,
                size: file.size,
            };
        })
        : [];

    if (!attachmentList.length)
        return next(new ErrorResponse("No attachments added", 404));

    try {
        const attachment = await Attachment.insertMany(attachmentList);
        await gamesImage.insertMany(
            Array.from(attachment, (per) => {
                return {
                    image: per._id.toString(),
                    games: games_id,
                };
            })
        );

        res.status(201).json({
            success: true,
            message: "Attachments uploaded successfully",
        });
    } catch (error) {
        // On Error
        // Send Error Response
        next(error);
    }
};

exports.delImage = async (req, res, next) => {
    const { image_id } = req.params;

    if (!image_id || !mongoose.Types.ObjectId.isValid(image_id))
        return next(new ErrorResponse("Please provide valid image id", 400));

    try {
        // const imageInfo =
        await gamesImage.findByIdAndDelete(image_id);
        // await Attachment.findByIdAndDelete(imageInfo.image);
        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};