retweet-club-members
====================

A Twitter bot that retweets tweets that appear in your timeline that contain desired hash tags.
This uses the [Twitter Streaming API](https://dev.twitter.com/docs/api/streaming), which means the retweets should happen almost immediately.

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
