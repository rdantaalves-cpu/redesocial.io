import { api } from '../services/api.js';
import { showToast } from '../services/toast.js';

function escapeHtml(value = '') {
	return value.replace(/[&<>"']/g, character => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[character]);
}

export function renderPost(post) {
	const tags = post.tags.map(tag => `<a href="#${encodeURIComponent(tag.slice(1))}">${escapeHtml(tag)}</a>`).join(' ');
	return `
		<article class="post" data-post-id="${escapeHtml(post.id)}">
			<div class="post-head">
				<img class="avatar" src="${escapeHtml(post.avatar)}" alt="">
				<div class="post-author"><strong>${escapeHtml(post.username)}</strong>${post.verified ? ' <span class="verified">●</span>' : ''}${post.location ? `<span>${escapeHtml(post.location)}</span>` : ''}</div>
				<button class="more-button" aria-label="Mais opções">···</button>
			</div>
			${post.image ? `<div class="post-image-wrap"><img class="post-image${post.location.startsWith('Paraty') ? ' landscape' : ''}" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.imageAlt)}"><span class="like-burst">♥</span></div>` : ''}
			<div class="post-actions"><button class="like-button" aria-label="Curtir publicação">♡</button><button class="comment-button" aria-label="Comentar">⌕</button><button class="share-button-icon" aria-label="Compartilhar">⌁</button><button class="save-button" aria-label="Salvar publicação">▤</button></div>
			<div class="post-copy"><span class="likes-count" data-count="${post.likes}">${post.likes} curtidas</span><p class="caption"><strong>${escapeHtml(post.username)}</strong> ${escapeHtml(post.caption)} ${tags}</p><button class="comments-link">Ver todos os ${post.comments} comentários</button><span class="post-time">${escapeHtml(post.time)}</span></div>
		</article>`;
}

class LumeFeed extends HTMLElement {
	connectedCallback() {
		this.setAttribute('aria-live', 'polite');
		this.load();
	}

	async load() {
		this.innerHTML = '<p class="feed-loading">Carregando publicações...</p>';
		try {
			const { posts } = await api.getPosts();
			this.innerHTML = posts.map(renderPost).join('');
		} catch {
			this.innerHTML = '<p class="feed-error">Não foi possível carregar o feed. <button type="button" data-retry>Recarregar</button></p>';
			this.querySelector('[data-retry]').addEventListener('click', () => this.load());
		}
	}

	prepend(post) {
		this.insertAdjacentHTML('afterbegin', renderPost(post));
	}

	async setLike(postElement, liked) {
		const count = postElement.querySelector('.likes-count');
		const button = postElement.querySelector('.like-button');
		const postId = postElement.dataset.postId;
		const previous = Number(count.dataset.count);
		button.classList.toggle('liked', liked);
		button.textContent = liked ? '♥' : '♡';
		count.dataset.count = String(Math.max(0, previous + (liked ? 1 : -1)));
		count.textContent = `${count.dataset.count} curtidas`;
		try {
			const result = await api.setLike(postId, liked);
			count.dataset.count = String(result.likes);
			count.textContent = `${result.likes} curtidas`;
		} catch {
			button.classList.toggle('liked', !liked);
			button.textContent = liked ? '♡' : '♥';
			count.dataset.count = String(previous);
			count.textContent = `${previous} curtidas`;
			showToast('Não foi possível atualizar a curtida.');
		}
	}
}

customElements.define('lume-feed', LumeFeed);