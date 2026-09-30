import { createApp } from './src/app.js';

const port = Number(process.env.PORT) || 4173;
const server = createApp();

server.listen(port, '127.0.0.1', () => {
	console.log(`Lume disponível em http://127.0.0.1:${port}`);
});