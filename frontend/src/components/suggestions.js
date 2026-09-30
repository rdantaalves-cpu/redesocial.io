class LumeSuggestions extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<aside class="right-rail" aria-label="Sugestões e tendências">
				<div class="rail-profile"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt=""><div><strong>marinacosta</strong><span>Marina Costa</span></div><button class="text-action">Ver perfil</button></div>
				<section class="rail-section"><div class="rail-title"><strong>Talvez você conheça</strong><button data-follow-all>Ver tudo</button></div>
					<div class="suggestion"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80" alt=""><div class="suggestion-info"><strong>beatriz.martins</strong><span>Seguido por ana.lima</span></div><button class="follow-button">Seguir</button></div>
					<div class="suggestion"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt=""><div class="suggestion-info"><strong>rafa.nunes</strong><span>Novidade para você</span></div><button class="follow-button">Seguir</button></div>
					<div class="suggestion"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt=""><div class="suggestion-info"><strong>clara.souza</strong><span>3 amigos em comum</span></div><button class="follow-button">Seguir</button></div>
					<div class="suggestion"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt=""><div class="suggestion-info"><strong>lucas.melo</strong><span>Seguido por pedro.alves</span></div><button class="follow-button">Seguir</button></div>
				</section>
				<section class="trend-block"><span class="eyebrow">Em alta hoje</span><h2>Gente e lugares<br>que inspiram.</h2><span class="trend-tag">#cantinhosdobrasil</span><span class="trend-tag">#luznatural</span><span class="trend-tag">#devagar</span></section>
				<footer class="rail-footer"><a href="#sobre">Sobre</a> · <a href="#ajuda">Ajuda</a> · <a href="#privacidade">Privacidade</a> · <a href="#termos">Termos</a><br>© 2026 Lume. Feito para compartilhar.</footer>
			</aside>`;
	}
}

customElements.define('lume-suggestions', LumeSuggestions);