const API_BASE = '/api';

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE}${path}`, {
		headers: { 'Content-Type': 'application/json', ...options.headers },
		...options
	});
	const data = await response.json();
	if (!response.ok) throw new Error(data.error || 'A solicitação não foi concluída.');
	return data;
}

export const api = {
	getPosts: () => request('/posts'),
	createPost: (caption, image = '') => request('/posts', { method: 'POST', body: JSON.stringify({ caption, image }) }),
	setLike: (postId, liked) => request(`/posts/${encodeURIComponent(postId)}/like`, {
		method: 'POST',
		body: JSON.stringify({ liked })
	})
};