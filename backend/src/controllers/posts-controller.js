function sendJson(response, status, data) {
	response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
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

function sendReadError(response, error, message) {
	sendJson(response, error instanceof RangeError ? 413 : 400, { error: message });
}

export function createPostsController(service) {
	return {
		list(_request, response) {
			sendJson(response, 200, { posts: service.list() });
		},
		async create(request, response) {
			try {
				const body = await readJson(request);
				const caption = typeof body.caption === 'string' ? body.caption.trim() : '';
				const image = typeof body.image === 'string' ? body.image : '';
				if (!caption || caption.length > 500) {
					sendJson(response, 400, { error: 'A legenda deve ter entre 1 e 500 caracteres.' });
					return;
				}
				if (image && !/^data:image\/(?:png|jpeg|webp|gif);base64,[\w+/=]+$/.test(image)) {
					sendJson(response, 400, { error: 'A imagem enviada não é válida.' });
					return;
				}
				sendJson(response, 201, { post: service.create({ caption, image }) });
			} catch (error) {
				sendReadError(response, error, 'Não foi possível ler os dados da publicação.');
			}
		},
		async like(request, response, postId) {
			try {
				const body = await readJson(request);
				if (typeof body.liked !== 'boolean') {
					sendJson(response, 400, { error: 'O campo liked deve ser booleano.' });
					return;
				}
				const likes = service.setLike(postId, body.liked);
				if (likes === null) {
					sendJson(response, 404, { error: 'Publicação não encontrada.' });
					return;
				}
				sendJson(response, 200, { likes });
			} catch (error) {
				sendReadError(response, error, 'Não foi possível atualizar a curtida.');
			}
		}
	};
}