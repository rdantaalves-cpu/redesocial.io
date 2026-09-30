import './components/navigation.js';
import './components/stories.js';
import './components/feed.js';
import './components/suggestions.js';
import './components/orbit-gallery.js';
import './components/dialogs.js';
import './components/assistant.js';
import { showToast } from './services/toast.js';

document.addEventListener('click', event => {
	const likeButton = event.target.closest('.like-button');
	if (likeButton) {
		const post = likeButton.closest('.post');
		document.querySelector('lume-feed').setLike(post, !likeButton.classList.contains('liked'));
		return;
	}

	const saveButton = event.target.closest('.save-button');
	if (saveButton) {
		const saved = saveButton.classList.toggle('liked');
		saveButton.textContent = saved ? '▣' : '▤';
		showToast(saved ? 'Publicação salva' : 'Publicação removida dos salvos');
		return;
	}

	const followButton = event.target.closest('.follow-button');
	if (followButton) {
		const following = followButton.classList.toggle('following');
		followButton.textContent = following ? 'Seguindo' : 'Seguir';
		return;
	}

	const navItem = event.target.closest('.nav-item');
	if (navItem) {
		document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item === navItem));
		if (navItem.dataset.nav !== 'Início') showToast(`${navItem.dataset.nav} estará disponível em breve`);
		return;
	}

	if (event.target.closest('.comment-button, .comments-link')) {
		showToast('Comentários em breve');
		return;
	}

	if (event.target.closest('.share-button-icon')) {
		showToast('Link da publicação copiado');
		return;
	}

	if (event.target.closest('[data-feed-refresh]')) {
		showToast('Você está vendo as publicações mais recentes');
		return;
	}

	if (event.target.closest('[data-follow-all]')) showToast('Estas pessoas podem gostar do que você compartilha');
});

document.addEventListener('dblclick', event => {
	const image = event.target.closest('.post-image-wrap');
	if (!image) return;
	const like = image.closest('.post').querySelector('.like-button');
	if (!like.classList.contains('liked')) like.click();
	const burst = image.querySelector('.like-burst');
	if (!burst) return;
	burst.classList.remove('show');
	void burst.offsetWidth;
	burst.classList.add('show');
});