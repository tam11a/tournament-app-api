const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var adminSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			maxLength: 11,
			unique: [true, "The Username is already taken"], // One Account with One Username
			required: [true, "Please Provide an Username"], // If Required
			trim: true,
		},
		phone: {
			type: String,
			validate: [/01\d{9}$/, "Invalid Phone Number"],
			required: [true, "Please Provide a Phone Number"],
			unique: [true, "Phone Number is already registered"],
		},
		// email: {
		//   type: String,
		//   required: [true, "Please Provide an Email Address"],
		//   unique: [true, "Email is already resigtered"], // One Account with One Email
		//   match: [
		//     /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
		//     "Invalid Email Address",
		//   ],
		//   trim: true,
		// },
		avatarUrl: {
			type: String,
			trim: true,
		},
		image: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Attachment",
			default: null,
		},
		password: {
			type: String,
			required: [true, "Please add a password"],
			minlength: [6, "Password must have atleast 6 Characters"],
			select: false,
		},
		isVerified: {
			type: Boolean,
			required: true,
			default: false,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
		isSuper: {
			type: Boolean,
			required: true,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
);

adminSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

adminSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

adminSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id, admin: true }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

/**
 * @swagger
 * components:
 *  schemas:
 *   Admin:
 *     type: object
 *     required:
 *        - userName
 *        - phone
 *        - password
 *     properties:
 *       userName:
 *         type: string
 *         unique: true
 *         maxLength: 11
 *       phone:
 *         type: string
 *         unique: true
 *         pattern: 01\d{9}$
 *       avatarUrl:
 *         type: string
 *       image:
 *         type: string
 *       password:
 *         type: string
 *         minLength: 6
 *       isVerified:
 *         type: boolean
 *         default: false
 *       isActive:
 *         type: boolean
 *         default: true
 *       isSuper:
 *         type: boolean
 *         default: false
 *
 */
