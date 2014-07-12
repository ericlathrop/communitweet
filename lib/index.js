"use strict";

var twit = require("twit");

var t = new twit(require("./keys"));

t.get("friends/ids", { "screen_name": "GameDevLouKY" }, function(err, data) {
	if (err) {
		console.err(err);
		return;
	}
	console.log(data);
});
