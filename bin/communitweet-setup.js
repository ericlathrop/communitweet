#!/usr/bin/env node
"use strict";

console.error("This program is for authorizing a communitweet app from one Twitter account to another. If you only have a single Twitter account, just set up a config.json file per the README.\n");

var config = require("../lib/config");
var cfg = config.get(config.filename());

var OAuth = require("oauth");
var oauth = new OAuth.OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		cfg.keys.consumer_key,
		cfg.keys.consumer_secret,
		"1.0A",
		null,
		"HMAC-SHA1"
		);

oauth.getOAuthRequestToken({ oauth_callback: "oob" }, function(err, token, tokenSecret) {
	if (err) {
		console.error("Error getting request token:", err);
		process.exit(1);
	}

	console.error("Visit the following URL in your browser to obtain a PIN:\n\nhttps://api.twitter.com/oauth/authenticate?oauth_token=" + token + "\n");

	var readline = require("readline");
	var rl = readline.createInterface(process.stdin, process.stderr);
	rl.question("PIN> ", function(pin) {
		oauth.getOAuthAccessToken(token, tokenSecret, pin, function(err, accessToken, accessTokenSecret) {
			if (err) {
				console.error("Error getting access token:", err);
				process.exit(1);
			}
			cfg.keys.access_token = accessToken;
			cfg.keys.access_token_secret = accessTokenSecret;
			config.set(config.filename(), cfg);
			console.error("Finished. You can now start \"communitweet " + config.filename() + "\"");
		});
		rl.close();
	});
});
