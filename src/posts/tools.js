'use strict';

const privileges = require('../privileges');

module.exports = function (Posts) {
	Posts.tools = {};

	Posts.tools.delete = async function (uid, pid) {
		return await togglePostDelete(uid, pid, true);
	};

	Posts.tools.restore = async function (uid, pid) {
		return await togglePostDelete(uid, pid, false);
	};

	Posts.tools.pin = async function (pid) {
		return await togglePin(pid, true);
	};

	Posts.tools.unpin = async function (pid) {
		return await togglePin(pid, false);
	};

	Posts.tools.isPinned = async function (pid) {
		const postData = await Posts.getPostData(pid);
		if (!postData) {
			throw new Error('[[error:no-post]]');
		}
		return postData.pinned === true;
	};

	async function togglePostDelete(uid, pid, isDelete) {
		const [postData, canDelete] = await Promise.all([
			Posts.getPostData(pid),
			privileges.posts.canDelete(pid, uid),
		]);
		if (!postData) {
			throw new Error('[[error:no-post]]');
		}

		if (postData.deleted && isDelete) {
			throw new Error('[[error:post-already-deleted]]');
		} else if (!postData.deleted && !isDelete) {
			throw new Error('[[error:post-already-restored]]');
		}

		if (!canDelete.flag) {
			throw new Error(canDelete.message);
		}
		let post;
		if (isDelete) {
			require('./cache').del(pid);
			post = await Posts.delete(pid, uid);
		} else {
			post = await Posts.restore(pid, uid);
			post = await Posts.parsePost(post);
		}
		return post;
	}

	async function togglePin(pid, shouldPin) {
		const postData = await Posts.getPostData(pid);

		if (!postData) {
			throw new Error('[[error:no-post]]');
		}

		if (postData.pinned === shouldPin) {
			const action = shouldPin ? 'pin-already-pinned' : 'pin-already-unpinned';
			throw new Error(`[[error:${action}]]`);
		}

		const updatedPost = await Posts.updatePostField(pid, 'pinned', shouldPin);

		require('./cache').del(pid);

		return updatedPost;
	}
};
