function escapeStringRegexp(string) {
	if (typeof string !== "string") {
		throw new TypeError("Expected a string");
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

exports.fieldsQuery = (args) => {
	return JSON.parse(JSON.stringify(args));
};

exports.queryObjectBuilder = (value, keys, isSearch, toObject) => {
	return value
		? toObject
			? Array.from(keys, (f) => {
					return this.flatSubquery(
						f,
						isSearch
							? {
									$regex: escapeStringRegexp(value),
									$options: "i",
							  }
							: value
					);
			  }).reduce((obj, e) => {
					return { ...obj, ...e };
			  }, {})
			: Array.from(keys, (f) => {
					return this.flatSubquery(
						f,
						isSearch ? this.searchRegex(value) : value
					);
			  })
		: value
		? {}
		: [];
};

exports.flatSubquery = (path, value) => {
	return typeof path === "string"
		? this.flatSubquery(path.split("."), value)
		: typeof path === "object"
		? path.length === 1
			? {
					[path[0]]: value,
			  }
			: {
					[path.shift()]: {
						$subquery: this.flatSubquery(path, value),
					},
			  }
		: {};
};

exports.searchRegex = (value) => {
	return {
		$regex: escapeStringRegexp(value),
		$options: "i",
	};
};
