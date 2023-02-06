const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

exports.upload = multer({
	storage: multer.diskStorage({
		destination: "../file_bucket",
		filename: (_req, _file, cb) => {
			let name = uuidv4() + "_" + Date.now();
			cb(null, name.replace(/-/g, "_"));
		},
	}),
});
