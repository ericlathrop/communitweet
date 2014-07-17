#!/usr/bin/env node
"use strict";

var config = require("../lib/config");
var cfg = config.get(config.filename());

var twit = require("twit");
var t = new twit(cfg.keys);

var hashtagsToWatch = cfg.hashtags.map(function(val) {
	return val.toLowerCase();
});

var friends = require("../lib/friends");

var myScreenName;
t.get("account/settings", {}, function(err, data) {
	if (err) {
		console.error("Error getting account info:", err);
		process.exit(1);
	}
	myScreenName = data.screen_name.toLowerCase();
});

var stream = t.stream("user");
stream.on("friends", function(friendIds) {
	friends.add(friendIds.friends);
});
stream.on("tweet", function(tweet) {
	if (!friends.isFriend(tweet.user.id)) {
		return;
	}

	if (shouldRetweet(tweet, hashtagsToWatch, myScreenName)) {
		console.log("RETWEETING:", "\"" + tweet.user.name + "\"", "@" + tweet.user.screen_name, tweet.text);
		retweet(tweet);
	}
});
stream.on("follow", function(follow) {
	if (myScreenName === follow.source.screen_name.toLowerCase()) {
		console.log("STARTED FOLLOWING:", follow.target.screen_name);
		friends.add(follow.target.id);
	}
});
stream.on("unfollow", function(follow) {
	if (myScreenName === follow.source.screen_name.toLowerCase()) {
		console.log("UNFOLLOWED:", follow.target.screen_name);
		friends.remove(follow.target.id);
	}
});
stream.on("disconnect", function(message) {
	console.error("DISCONNECTED:", message);
	process.exit();
});

function shouldRetweet(tweet, hashtags, screenName) {
	if (isRetweet(tweet)) {
		return false;
	}
	var ht = hasHashtags(tweet, hashtags);
	var m = doesMentionScreenName(tweet, screenName);
	return hasHashtags(tweet, hashtags) || doesMentionScreenName(tweet, screenName);
}

function hasHashtags(tweet, hashtags) {
	return tweet.entities.hashtags.filter(function(hashtag) {
		hashtag = hashtag.text.toLowerCase();
		return hashtags.indexOf(hashtag) !== -1;
	}).length > 0;
}

function isRetweet(tweet) {
	return !!tweet.retweeted_status;
}

function doesMentionScreenName(tweet, screenName) {
	return tweet.entities.user_mentions.filter(function(mention) {
		return mention.screen_name.toLowerCase() === screenName && mention.indices[0] > 0;
	}).length > 0;
}

function retweet(tweet) {
	t.post("statuses/retweet/:id", { id: tweet.id_str  }, function(err) {
		if (err) {
			console.error("Failed retweeting", tweet.id, ":", err);
			return;
		}
		console.log("Retweeted", tweet.id);
	});
}
