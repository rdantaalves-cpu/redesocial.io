# Lume

Rede social de demonstração com frontend modular, API em Node.js e câmera 3D interativa.

## Requisitos

- Node.js 20 ou superior
- Navegador moderno com suporte a ES Modules e WebGL
- Acesso à internet para carregar Three.js, fontes e imagens de demonstração

## Executar

```bash
npm start
```

Abra `http://127.0.0.1:4173`. Para usar outra porta, defina a variável `PORT` antes de iniciar. Em desenvolvimento, `npm run dev` reinicia o servidor quando os arquivos do backend mudam.

## Testes

```bash
npm test
```

## Estrutura

```text
frontend/
	index.html
	styles/
		components/
		app.css
		responsive.css
		tokens.css
	src/
		components/
		services/
		app.js
backend/
	src/
		controllers/
		data/
		routes/
		services/
		app.js
	test/
	server.js
```

### Frontend

- `src/components/` contém elementos independentes para feed, stories, navegação, sugestões, diálogos e assistente.
- `src/services/api.js` centraliza as chamadas HTTP.
- `src/services/camera3d.js` constrói e controla o modelo Three.js; o canvas responde a mouse e toque e respeita movimento reduzido.
- `styles/components/` mantém os estilos dos componentes separados; `responsive.css` centraliza os breakpoints.

### Backend

- `routes/` encaminha requisições HTTP.
- `controllers/` valida entradas e monta respostas.
- `services/` concentra a lógica de publicações e curtidas.
- `data/` contém os dados iniciais de demonstração.
- A API oferece `GET /api/health`, `GET /api/posts`, `POST /api/posts` e `POST /api/posts/:id/like`.

Os dados ficam em memória e são recriados ao reiniciar o servidor. O armazenamento persistente pode ser conectado ao serviço de publicações sem alterar os componentes do frontend.