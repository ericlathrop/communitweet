#!/usr/bin/env node
"use strict";

var fs = require("fs");

function getConfig() {
	var args = process.argv.slice(2);
	if (args.length !== 1) {
		console.error("Usage: retweet-club-members config.json");
		process.exit(1);
	}
	return JSON.parse(fs.readFileSync(args[0], { encoding: 'utf8' }));
}

var config = getConfig();
var keys = config.keys;

var twit = require("twit");
var t = new twit(keys);

var hashtagsToWatch = config.hashtags.map(function(val) {
	return val.toLowerCase();
});

var friendIds = {};

var myScreenName;
t.get("account/settings", {}, function(err, data) {
	if (err) {
		console.error("Error getting account info:", err);
		process.exit(1);
	}
	myScreenName = data.screen_name.toLowerCase();
});

var stream = t.stream("user");
stream.on("friends", function(friends) {
	friends = friends.friends;
	for (var i = 0; i < friends.length; i++) {
		var friendId = friends[i];
		friendIds[friendId] = true;
	}
});
stream.on("tweet", function(tweet) {
	var isFriend = friendIds[tweet.user.id];
	if (!isFriend) {
		return;
	}

	console.log("TWEET:", "\"" + tweet.user.name + "\"", "@" + tweet.user.screen_name, tweet.text);

	var ht = tweet.entities.hashtags;
	for (var i = 0; i < ht.length; i++) {
		var tag = ht[i].text.toLowerCase();
		console.log("HASHTAG:", tag);

		if (hashtagsToWatch.indexOf(tag) !== -1) {
			console.log("RETWEETING:", tweet.id);
			retweet(tweet);
			break;
		}
	}
});
stream.on("follow", function(follow) {
	if (myScreenName === follow.source.screen_name.toLowerCase()) {
		console.log("STARTED FOLLOWING:", follow.target.screen_name);
		friendIds[follow.target.id] = true;
	}
});
stream.on("disconnect", function(message) {
	console.error("DISCONNECTED:", message);
	process.exit();
});

function retweet(tweet) {
	t.post("statuses/retweet/:id", { id: tweet.id_str  }, function(err) {
		if (err) {
			console.error("Failed retweeting", tweet.id, ":", err);
			return;
		}
		console.log("Retweeted", tweet.id);
	});
}
