import { api } from '../services/api.js';
import { showToast } from '../services/toast.js';

class LumeDialogs extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="modal-backdrop" id="compose-modal" role="dialog" aria-modal="true" aria-labelledby="compose-title">
				<div class="modal">
					<div class="modal-head"><strong id="compose-title">Criar publicação</strong><button data-close-modal aria-label="Fechar">×</button></div>
					<form class="modal-body" id="compose-form"><textarea name="caption" placeholder="O que você quer compartilhar?" aria-label="Legenda da publicação" maxlength="500" required></textarea><div class="modal-tools"><label class="upload-label">＋ Adicionar uma foto<input name="image" type="file" accept="image/*"></label><button class="share-button" type="submit">Compartilhar</button></div></form>
				</div>
			</div>
			<div class="modal-backdrop story-backdrop" id="story-modal" role="dialog" aria-modal="true" aria-label="Story"><div class="story-view"><div class="story-progress" aria-hidden="true"><span></span></div><header class="story-header"><img class="story-avatar" alt=""><span class="story-user"></span><time>agora</time><button class="story-close" data-close-modal aria-label="Fechar story">×</button></header><img class="story-image" alt=""><div class="story-caption"></div><button class="story-nav story-previous" type="button" aria-label="Story anterior">‹</button><button class="story-nav story-next" type="button" aria-label="Próximo story">›</button><div class="story-reply"><input type="text" placeholder="Responder à história..." aria-label="Responder à história"><button type="button" aria-label="Enviar reação">♡</button></div></div></div>`;
		document.addEventListener('click', event => {
			const opener = event.target.closest('[data-open-compose]');
			if (opener) {
				this.open('compose-modal');
				this.querySelector('textarea').focus();
			}
			const closer = event.target.closest('[data-close-modal]');
			if (closer) this.close(closer.closest('.modal-backdrop'));
			if (event.target.classList.contains('modal-backdrop')) this.close(event.target);
			const story = event.target.closest('.story');
			if (story) this.openStory(story);
			if (event.target.closest('.story-next')) this.moveStory(1);
			if (event.target.closest('.story-previous')) this.moveStory(-1);
			if (event.target.closest('.story-reply button')) showToast('Reação enviada.');
		});
		this.querySelector('#compose-form').addEventListener('submit', event => this.createPost(event));
		this.querySelector('#story-modal .story-view').addEventListener('click', event => {
			if (event.target.closest('.story-header, .story-reply, .story-nav, .story-close')) return;
			const bounds = event.currentTarget.getBoundingClientRect();
			this.moveStory(event.clientX < bounds.left + bounds.width * 0.38 ? -1 : 1);
		});
		document.addEventListener('keydown', event => {
			if (event.key === 'Escape') this.querySelectorAll('.modal-backdrop.open').forEach(modal => this.close(modal));
			if (this.querySelector('#story-modal.open')) {
				if (event.key === 'ArrowRight') this.moveStory(1);
				if (event.key === 'ArrowLeft') this.moveStory(-1);
			}
		});
		this.storyIndex = 0;
	}

	open(id) {
		this.querySelector(`#${id}`).classList.add('open');
	}

	close(modal) {
		modal.classList.remove('open');
	}

	openStory(story) {
		const modal = this.querySelector('#story-modal');
		this.stories = [...document.querySelectorAll('lume-stories .story')];
		this.storyIndex = this.stories.indexOf(story);
		this.updateStory();
		this.open('story-modal');
	}

	moveStory(direction) {
		if (!this.stories?.length) return;
		this.storyIndex = (this.storyIndex + direction + this.stories.length) % this.stories.length;
		this.updateStory();
	}

	updateStory() {
		const story = this.stories[this.storyIndex];
		const modal = this.querySelector('#story-modal');
		modal.querySelector('.story-image').src = story.dataset.image;
		modal.querySelector('.story-caption').textContent = story.dataset.story;
		modal.querySelector('.story-avatar').src = story.querySelector('img').src;
		modal.querySelector('.story-user').textContent = story.querySelector('.story-name').textContent;
		modal.querySelector('.story-progress').style.setProperty('--story-progress', `${((this.storyIndex + 1) / this.stories.length) * 100}%`);
		modal.querySelector('.story-previous').disabled = this.stories.length < 2;
		modal.querySelector('.story-next').disabled = this.stories.length < 2;
	}

	async createPost(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const submit = form.querySelector('[type="submit"]');
		const caption = form.elements.caption.value.trim();
		const file = form.elements.image.files[0];
		let image = '';
		if (file) {
			if (!file.type.startsWith('image/')) {
				showToast('Escolha um arquivo de imagem.');
				return;
			}
			if (file.size > 700_000) {
				showToast('A imagem deve ter até 700 KB nesta versão.');
				return;
			}
			image = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.addEventListener('load', () => resolve(reader.result));
				reader.addEventListener('error', reject);
				reader.readAsDataURL(file);
			});
		}
		submit.disabled = true;
		try {
			const { post } = await api.createPost(caption, image);
			document.querySelector('lume-feed').prepend(post);
			form.reset();
			this.close(this.querySelector('#compose-modal'));
			showToast('Publicação adicionada ao feed.');
		} catch (error) {
			showToast(error.message || 'Não foi possível criar a publicação.');
		} finally {
			submit.disabled = false;
		}
	}
}

customElements.define('lume-dialogs', LumeDialogs);