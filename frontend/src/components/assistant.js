import * as THREE from 'three';
import { createCameraScene } from '../services/camera3d.js';
import { showToast } from '../services/toast.js';

class LumeAssistant extends HTMLElement {
	connectedCallback() {
		this.classList.add('helper');
		this.innerHTML = `
			<div class="helper-nudge" id="helper-nudge"><strong>Oi, Marina!</strong> Quer uma ideia para compartilhar?</div>
			<section class="helper-panel" id="helper-panel" aria-label="Conversa com Lume" aria-hidden="true">
				<header class="helper-head"><div class="helper-head-copy"><strong>Lume, por aqui</strong><span><i class="helper-online"></i>Pronto para ajudar</span></div><button type="button" id="helper-motion" aria-label="Pausar animação" title="Pausar animação">Ⅱ</button><button type="button" id="helper-close" aria-label="Fechar conversa">×</button></header>
				<div class="helper-messages" id="helper-messages" aria-live="polite"><div class="helper-message">Oi, Marina! Posso ajudar a criar uma publicação, explicar os ícones ou pensar numa legenda.</div></div>
				<div class="helper-prompts"><button type="button" data-helper-prompt="create">Criar publicação</button><button type="button" data-helper-prompt="idea">Me dê uma ideia</button><button type="button" data-helper-prompt="help">Como funciona?</button></div>
				<form class="helper-form" id="helper-form"><input type="text" maxlength="180" placeholder="Escreva uma mensagem..." aria-label="Mensagem para Lume" required><button type="submit" aria-label="Enviar mensagem">➤</button></form>
				<p class="helper-hint">Arraste a câmera para girar · Esc fecha a conversa</p>
			</section>
			<button class="helper-trigger" id="helper-trigger" type="button" aria-label="Abrir conversa com Lume" aria-expanded="false" aria-controls="helper-panel" title="Converse com Lume"><span class="helper-scene" id="helper-scene"><span class="helper-fallback" aria-hidden="true">📷</span><canvas class="helper-canvas" id="helper-canvas" aria-label="Câmera 3D interativa"></canvas></span></button>`;
		this.panel = this.querySelector('#helper-panel');
		this.trigger = this.querySelector('#helper-trigger');
		this.messages = this.querySelector('#helper-messages');
		this.camera = null;
		this.bindEvents();
		this.loadCamera();
	}

	bindEvents() {
		this.addEventListener('click', event => {
			const prompt = event.target.closest('[data-helper-prompt]');
			if (prompt) this.handlePrompt(prompt.dataset.helperPrompt);
		});
		this.trigger.addEventListener('click', () => {
			if (this.camera?.wasDragged()) {
				this.camera.clearDrag();
				return;
			}
			this.setOpen(!this.classList.contains('open'));
		});
		this.querySelector('#helper-close').addEventListener('click', () => this.setOpen(false));
		this.querySelector('#helper-motion').addEventListener('click', event => {
			if (!this.camera) return;
			const enabled = this.camera.toggleAnimation();
			event.currentTarget.textContent = enabled ? 'Ⅱ' : '▶';
			event.currentTarget.setAttribute('aria-label', enabled ? 'Pausar animação' : 'Retomar animação');
			event.currentTarget.title = enabled ? 'Pausar animação' : 'Retomar animação';
		});
		this.querySelector('#helper-form').addEventListener('submit', event => {
			event.preventDefault();
			const input = event.currentTarget.querySelector('input');
			const text = input.value.trim();
			if (!text) return;
			this.addMessage(text, 'user');
			this.addMessage(this.answerFor(text));
			input.value = '';
		});
		document.addEventListener('keydown', event => {
			if (event.key === 'Escape' && this.classList.contains('open')) this.setOpen(false);
		});
		document.addEventListener('click', event => {
			if (event.target.closest('.like-button')) this.setNudge('<strong>Um coração já diz muito.</strong> Salve também o que inspirou você.');
			if (event.target.closest('.story')) this.setNudge('<strong>Stories são momentos leves.</strong> Toque no + para compartilhar o seu.');
		});
	}

	async loadCamera() {
		try {
			this.camera = createCameraScene(THREE, this.querySelector('canvas'), () => {
				this.querySelector('#helper-scene').classList.add('ready');
			});
		} catch (error) {
			console.warn('A câmera 3D não pôde ser carregada; o assistente continua disponível.', error);
		}
	}

	setOpen(open) {
		this.classList.toggle('open', open);
		this.trigger.setAttribute('aria-expanded', String(open));
		this.panel.setAttribute('aria-hidden', String(!open));
		if (open) this.querySelector('#helper-form input').focus();
		else this.trigger.focus();
	}

	addMessage(text, sender = 'assistant') {
		const message = document.createElement('div');
		message.className = `helper-message${sender === 'user' ? ' user' : ''}`;
		message.textContent = text;
		this.messages.append(message);
		this.messages.scrollTop = this.messages.scrollHeight;
	}

	answerFor(text) {
		const query = text.toLocaleLowerCase('pt-BR');
		if (/post|public|foto|compart/.test(query)) return 'Toque no botão + para escrever uma legenda e escolher uma foto. Sua publicação aparece no feed.';
		if (/story|hist[oó]ria/.test(query)) return 'Toque em qualquer círculo colorido na faixa de stories. Você também pode abrir “Sua história” para começar a sua.';
		if (/curt|cora[cç][aã]o|like/.test(query)) return 'Toque no coração para curtir ou toque duas vezes na foto. Um toque no marcador salva a publicação.';
		if (/seguir|perfil|pessoa/.test(query)) return 'Use “Seguir” nas sugestões ao lado do feed. Assim, novas publicações dessas pessoas aparecem para você.';
		if (/ideia|inspira|legenda/.test(query)) return 'Que tal compartilhar um pequeno detalhe do seu dia? Uma luz bonita, seu café favorito ou um lugar que dá vontade de voltar.';
		return 'Estou aqui para ajudar com stories, curtidas, perfis e publicações. O que você gostaria de fazer?';
	}

	handlePrompt(prompt) {
		if (prompt === 'create') {
			this.addMessage('Vamos criar uma publicação.', 'user');
			this.addMessage('Ótimo! Escreva o que quer compartilhar e adicione uma foto.');
			this.setOpen(false);
			document.querySelector('[data-open-compose]').click();
			return;
		}
		this.addMessage(prompt === 'idea' ? 'Me dê uma ideia para compartilhar' : 'Como funciona?', 'user');
		this.addMessage(prompt === 'idea' ? this.answerFor('ideia') : 'Você pode curtir, salvar e comentar publicações. Abra um story tocando no círculo da pessoa e use o + para compartilhar algo seu.');
	}

	setNudge(message) {
		this.querySelector('#helper-nudge').innerHTML = message;
	}
}

customElements.define('lume-assistant', LumeAssistant);