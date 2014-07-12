# Communitweet

Communitweet creates a central Twitter account for your community by automatically retweeting community members.

Communitweet retweets tweets that appear in your timeline that contain hash tags that you specify. 
As your twitter account follows new members of your community, they become eligible for retweets automatically.

Communitweet uses the [Twitter Streaming API](https://dev.twitter.com/docs/api/streaming), which means the retweets should happen almost immediately.

## Setup

1. Install [Node.js](http://nodejs.org/)
2. Run `npm install -g communitweet`
3. [Create a Twitter app](https://apps.twitter.com/) to get the required API keys for the bot to work.
4. Create a configuration file, and name it something like "config.json". The configuration file format is below.
5. Run `communitweet config.json`

## Configuration

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
The hashtag list is case-insensitive.
