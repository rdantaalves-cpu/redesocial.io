import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDemoPosts } from './data/posts.js';
import { createPostsController } from './controllers/posts-controller.js';
import { handlePostRoutes } from './routes/posts.js';
import { createPostsService } from './services/posts-service.js';

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend');
const contentTypes = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp'
};

function sendJson(response, status, data) {
	response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
	response.end(JSON.stringify(data));
}

export function createApp({ posts = createDemoPosts() } = {}) {
	const postsController = createPostsController(createPostsService(posts));
	return createServer(async (request, response) => {
		const url = new URL(request.url, 'http://localhost');
		if (url.pathname === '/api/health' && request.method === 'GET') {
			sendJson(response, 200, { status: 'ok' });
			return;
		}

		if (url.pathname.startsWith('/api/')) {
			const handled = handlePostRoutes(request, response, postsController, url.pathname);
			if (!handled) sendJson(response, 404, { error: 'Rota da API não encontrada.' });
			return;
		}

		if (request.method !== 'GET' && request.method !== 'HEAD') {
			response.writeHead(405, { Allow: 'GET, HEAD' });
			response.end();
			return;
		}

		let pathname;
		try {
			pathname = decodeURIComponent(url.pathname);
		} catch {
			response.writeHead(400);
			response.end('Bad request');
			return;
		}
		const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
		const filePath = path.resolve(frontendRoot, relativePath);
		if (!filePath.startsWith(`${frontendRoot}${path.sep}`)) {
			response.writeHead(403);
			response.end('Forbidden');
			return;
		}

		try {
			const content = await readFile(filePath);
			response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
			response.end(request.method === 'HEAD' ? undefined : content);
		} catch {
			response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
			response.end('Not found');
		}
	});
}