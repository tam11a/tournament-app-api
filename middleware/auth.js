const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Admin = require("../model/Admin");
const User = require("../model/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) return next(new ErrorResponse("Unauthorized user!", 401));

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (
			!decoded.id ||
			!mongoose.Types.ObjectId.isValid(decoded.id) ||
			!!req.admin !== !!decoded.admin
		)
			return next(new ErrorResponse("Unauthorized user!", 401));

		const user = decoded.admin
			? await Admin.findOne({
					_id: decoded.id,
					isActive: true,
					isVerified: true,
			  })
			: await User.findOne({
					_id: decoded.id,
					isActive: true,
					isVerified: true,
			  });

		if (!user) return next(new ErrorResponse("Unauthorized user!", 401));

		req.user = user;
		req.isAdmin = decoded.admin;
		next();
	} catch (error) {
		// error
		return next(new ErrorResponse(error));
	}
};

exports.adminProtect = async (req, res, next) => {
	req.admin = true;
	next();
};
