"use strict";

var fs = require("fs");

exports.filename = function() {
	var args = process.argv.slice(2);
	if (args.length !== 1) {
		console.error("Usage: " + process.argv[1] + " config.json");
		process.exit(1);
	}
	return args[0];
};
exports.get = function(filename) {
	return JSON.parse(fs.readFileSync(filename, { encoding: "utf8" }));
};
exports.set = function(filename, config) {
	fs.writeFileSync(filename, JSON.stringify(config, null, 4), { encoding: "utf8" });
};
