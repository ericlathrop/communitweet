"use strict";

var twit = require("twit");
var t = new twit(require("./keys"));

var myScreenName = "ericlathrop";
var hashtagsToWatch = ["gamedev", "gamedevlou", "screenshotsaturday", "rtbot" ];
var friendIds = {};

var stream = t.stream("user");
stream.on("friends", function(friends) {
	friends = friends.friends;
	for (var i = 0; i < friends.length; i++) {
		var friendId = friends[i];
		friendIds[friendId] = true;
	}
});
stream.on("tweet", function(tweet) {
	logTweet(tweet);

	var isFriend = friendIds[tweet.user.id];
	console.log("FRIEND?", isFriend);
	if (!isFriend) {
		return;
	}

	var ht = tweet.entities.hashtags;
	for (var i = 0; i < ht.length; i++) {
		var tag = ht[i].text.toLowerCase();
		console.log("HASHTAG", tag);

		if (hashtagsToWatch.indexOf(tag) !== -1) {
			console.log("RETWEETING!", tweet.id);
			retweet(tweet);
			break;
		}
	}
});
stream.on("follow", function(follow) {
	console.log("FOLLOW", follow);
	if (follow.source.screen_name.toLowerCase() === myScreenName.toLowerCase()) {
		console.log("STARTED FOLLOWING", follow.target.screen_name);
		friendIds[follow.target.id] = true;
	}
});
stream.on("disconnect", function(message) {
	console.log("Disconnected:", message);
	process.exit();
});

function retweet(tweet) {
	t.post("statuses/retweet/:id", { id: tweet.id }, function(err) {
		if (err) {
			console.err("Failed retweeting", tweet.id, ":", err);
			return;
		}
		console.log("Retweeted", tweet.id);
	});
}

function logTweet(tweet) {
	console.log("TWEET:", "\"" + tweet.user.name + "\"", "@" + tweet.user.screen_name, tweet.text);
	// console.log(tweet);
}
