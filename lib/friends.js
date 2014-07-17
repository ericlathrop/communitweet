"use strict";

module.exports = {
	friendIds: {},
	add: function(friendIds) {
		if (typeof friendIds === "number") {
			friendIds = [friendIds];
		}
		for (var i = 0; i < friendIds.length; i++) {
			var friendId = friendIds[i];
			this.friendIds[friendId] = true;
		}
	},
	remove: function(friendId) {
		delete this.friendIds[friendId];
	},
	isFriend: function(friendId) {
		return !!this.friendIds[friendId];
	}
};
