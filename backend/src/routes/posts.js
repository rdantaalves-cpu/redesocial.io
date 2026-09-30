const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };

function sendJson(response, status, data) {
	response.writeHead(status, jsonHeaders);
	response.end(JSON.stringify(data));
}

async function readJson(request) {
	let body = '';
	for await (const chunk of request) {
		body += chunk;
		if (body.length > 1_000_000) throw new RangeError('Request body is too large');
	}
	return body ? JSON.parse(body) : {};
}

export function handlePostRoutes(request, response, controller, pathname) {
	if (pathname === '/api/posts' && request.method === 'GET') {
		controller.list(request, response);
		return true;
	}

	if (pathname === '/api/posts' && request.method === 'POST') {
		void controller.create(request, response);
		return true;
	}

	const likeRoute = pathname.match(/^\/api\/posts\/([^/]+)\/like$/);
	if (likeRoute && request.method === 'POST') {
		void controller.like(request, response, likeRoute[1]);
		return true;
	}

	return false;
}