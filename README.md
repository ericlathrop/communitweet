retweet-club-members
====================

A twitter bot that retweets members of a club.

This program will retweet tweets that appear in the user's timeline that has the desired hash tags.

The configuration is stored in a JSON file that looks like:

```json
{
	"keys": {
		"consumer_key": "...",
		"consumer_secret": "...",
		"access_token": "...",
		"access_token_secret": "..."
	},
	"hashtags": [
		"GameDev",
		"ScreenshotSaturday",
	]
}
```

You'll need to [create a Twitter app](https://apps.twitter.com/) to get the required API keys for the bot to work.

The hashtag list is case-insensitive.

This uses the [Twitter Streaming API](https://dev.twitter.com/docs/api/streaming), which means the retweets should happen almost immediately.
