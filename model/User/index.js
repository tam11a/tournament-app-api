const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticator, totp } = require("otplib");
const base32 = require("base32");

var userSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			maxLength: 11,
			unique: [true, "The Username is already taken"], // One Account with One Username
			required: [true, "Please Provide an Username"], // If Required
			trim: true,
		},
		fullName: {
			type: String,
			maxLength: 32,
			required: [true, "Please Provide Full Name"],
			trim: true,
		},
		phone: {
			type: String,
			validate: [/01\d{9}$/, "Invalid Phone Number"],
			// required: [true, "Please Provide a Phone Number"],
			// unique: [true, "Phone Number is already registered"],
			default: null,
		},
		email: {
			type: String,
			required: [true, "Please Provide an Email Address"],
			unique: [true, "Email is already resigtered"], // One Account with One Email
			match: [
				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
				"Invalid Email Address",
			],
			trim: true,
		},
		avatarUrl: {
			type: String,
			trim: true,
			default: null,
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
			trim: true,
		},
		verificationKey: { type: String, select: false, trim: true },
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
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	this.verificationKey = authenticator.generateSecret();
	next();
});

userSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id, admin: false }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

userSchema.methods.getTOTP = async function () {
	totp.options = {
		algorithm: "sha1",
		encoding: "ascii",
		digits: 6,
		epoch: Date.now(),
		step: 300,
		window: 300,
	};
	return totp.generate(this.verificationKey);
};

userSchema.methods.verifyTOTP = async function (otp) {
	totp.options = {
		algorithm: "sha1",
		encoding: "ascii",
		digits: 6,
		epoch: Date.now(),
		step: 300,
		window: 300,
	};
	return totp.check(otp, this.verificationKey);
};

userSchema.methods.getBase32ID = async function () {
	return base32.encode(this._id.toString());
};

userSchema.methods.updatePassword = async function (password) {
	this.password = password;
	await this.save();
};

userSchema.methods.verifyUser = async function () {
	this.isVerified = true;
	await this.save();
};

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
module.exports = User;

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *     type: object
 *     required:
 *        - userName
 *        - fullName
 *        - email
 *        - password
 *     properties:
 *       userName:
 *         type: string
 *         unique: true
 *         maxLength: 11
 *       fullName:
 *         type: string
 *         maxLength: 32
 *       phone:
 *         type: string
 *         unique: true
 *         pattern: 01\d{9}$
 *       email:
 *         type: string
 *         unique: true
 *         pattern: ^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$
 *         default: example@email.com
 *       avatarUrl:
 *         type: string
 *       image:
 *         type: string
 *       password:
 *         type: string
 *         minLength: 6
 *
 */
