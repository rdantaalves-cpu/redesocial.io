export function createPostsService(posts) {
	return {
		list() {
			return posts;
		},
		create({ caption, image = '' }) {
			const post = {
				id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				username: 'marinacosta',
				location: '',
				avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
				image,
				imageAlt: 'Imagem da publicação',
				caption,
				tags: [],
				likes: 0,
				comments: 0,
				time: 'Agora',
				verified: false
			};
			posts.unshift(post);
			return post;
		},
		setLike(postId, liked) {
			const post = posts.find(item => item.id === postId);
			if (!post) return null;
			post.likes = Math.max(0, post.likes + (liked ? 1 : -1));
			return post.likes;
		}
	};
}