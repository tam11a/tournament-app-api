const Admin = require("../../model/Admin");
const ErrorResponse = require("../../utils/errorResponse");

exports.register = async (req, res, next) => {
    // Get Values
    const { userName, email, avatarUrl, password } = req.body;

    try {
        // Store Admin to DB
        const user = await Admin.create({
            userName,
            // phone,
            email,
            avatarUrl,
            password,
        });

        // Send Success Response & Login Token
        sendToken(user, 201, res);

        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(ErrorResponse("Please provide email and password", 400));

    try {
        const user = await Admin.findOne({
            email,
            isVerified: true,
            isActive: true,
        }).select("+password");

        // Send Error if No Admin Found
        if (!user) next(new ErrorResponse("Invalid credentials", 401));

        // Check if the password is corrent
        const isMatch = await user.matchPasswords(password);
        if (!isMatch) next(new ErrorResponse("Incorrect password", 401));

        // Send Success Response
        sendToken(user, 200, res);
        // On Error
    } catch (error) {
        // Send Error Response
        next(error);
    }
};

exports.forgetpassword = async (req, res, next) => {
    res.send("Forget Password Route");
};

exports.resetpassword = async (req, res, next) => {
    res.send("Reset Password Route");
};

exports.validate = async (req, res, next) => {
    if (req.user)
        res.json({
            success: true,
            data: req.user,
        });
    else {
        return next(ErrorResponse("No Admin Found!", 404));
    }
};

const sendToken = (user, statusCode, res) => {
    res.status(statusCode).json({
        success: true,
        token: user.getSignedToken(), // generates token
    });
};

// https://youtu.be/YocRq-KesCM