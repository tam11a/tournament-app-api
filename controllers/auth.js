const base32 = require("base32");
const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
	const { userName, fullName, phone, email, avatarUrl, image, password } =
		req.body;

	try {
		const user = await User.create({
			userName,
			fullName,
			phone,
			email,
			avatarUrl,
			image,
			password,
		});
		res.status(201).json({
			success: true,
			token: await user.getBase32ID(),
			otp: await user.getTOTP(),
		});
	} catch (error) {
		next(error);
	}
};

exports.verify = async (req, res, next) => {
	const { token, otp } = req.body;
	const userId = base32.decode(token);
	try {
		const user = await User.findById(userId).select("+verificationKey");
		if (!user) return next(new ErrorResponse("No user found", 404));

		if (!(await user.verifyTOTP(otp)))
			return next(new ErrorResponse("Invalid OTP", 401));

		await user.verifyUser();

		res.status(200).json({
			success: true,
			token: user.getSignedToken(),
		});
	} catch (error) {
		next(error);
	}
};

exports.validate = async (req, res, next) => {
	if (req.user)
		res.json({
			success: true,
			data: {
				...req.user._doc,
			},
		});
	else {
		next(ErrorResponse("No user found!", 404));
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(ErrorResponse("Please provide phone and password", 400));

	try {
		const user = await User.findOne({
			email,
			isVerified: true,
			isActive: true,
		}).select("+password");

		// Send Error if No User Found
		if (!user) return next(new ErrorResponse("Invalid credentials", 401));

		// Check if the password is corrent
		const isMatch = await user.matchPasswords(password);
		if (!isMatch) return next(new ErrorResponse("Incorrect password", 401));

		res.status(200).json({
			success: true,
			token: user.getSignedToken(),
		});
		// On Error
	} catch (error) {
		// Send Error Response
		next(error);
	}
};
