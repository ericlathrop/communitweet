"use strict";

var twit = require("twit");
var t = new twit(require("./keys"));

var hashtagsToWatch = ["gamedev", "gamedevlou", "screenshotsaturday", "rtbot" ];
var friendIds = {};

var myScreenName;
t.get("account/settings", {}, function(err, data) {
	if (err) {
		console.err("Error getting account info:", err);
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
	if (myScreenName === follow.source.screen_name.toLowerCase()) {
		console.log("STARTED FOLLOWING", follow.target.screen_name);
		friendIds[follow.target.id] = true;
	}
});
stream.on("disconnect", function(message) {
	console.err("Disconnected:", message);
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
