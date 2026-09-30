import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

async function withServer(run) {
	const server = createApp();
	await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
	const address = server.address();
	try {
		await run(`http://127.0.0.1:${address.port}`);
	} finally {
		await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
	}
}

test('serves health, posts, likes, post creation and frontend assets', async () => {
	await withServer(async baseUrl => {
		const health = await fetch(`${baseUrl}/api/health`);
		assert.deepEqual(await health.json(), { status: 'ok' });

		const listResponse = await fetch(`${baseUrl}/api/posts`);
		const { posts } = await listResponse.json();
		assert.equal(posts.length, 2);

		const likeResponse = await fetch(`${baseUrl}/api/posts/paraty-01/like`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ liked: true })
		});
		assert.deepEqual(await likeResponse.json(), { likes: 285 });

		const createResponse = await fetch(`${baseUrl}/api/posts`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ caption: 'Um novo momento.' })
		});
		assert.equal(createResponse.status, 201);
		assert.equal((await createResponse.json()).post.caption, 'Um novo momento.');

		const frontend = await fetch(baseUrl);
		assert.equal(frontend.status, 200);
		assert.match(await frontend.text(), /Lume/);
	});
});