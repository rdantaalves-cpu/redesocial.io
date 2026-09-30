class LumeSidebar extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<aside class="sidebar" aria-label="Navegação principal">
				<a class="brand" href="#inicio" aria-label="Lume, início"><span class="brand-mark">l</span><span class="brand-name">lume</span></a>
				<p class="nav-label">Menu</p>
				<nav class="nav-list">
					<button class="nav-item active" data-nav="Início"><span class="nav-icon">⌂</span>Início</button>
					<button class="nav-item" data-nav="Explorar"><span class="nav-icon">⌕</span>Explorar</button>
					<button class="nav-item" data-nav="Mensagens"><span class="nav-icon">▱</span>Mensagens <span style="margin-left:auto;color:var(--coral);font-size:10px">2</span></button>
					<button class="nav-item" data-nav="Notificações"><span class="nav-icon">♡</span>Notificações</button>
					<button class="nav-item" data-nav="Salvos"><span class="nav-icon">▤</span>Salvos</button>
				</nav>
				<div class="nav-spacer"></div>
				<p class="nav-label">Sua conta</p>
				<nav class="nav-list">
					<button class="nav-item" data-nav="Meu perfil"><span class="nav-icon">◉</span>Meu perfil</button>
					<button class="nav-item" data-nav="Configurações"><span class="nav-icon">⚙</span>Configurações</button>
				</nav>
				<button class="nav-compose" data-open-compose>＋ &nbsp; Criar publicação</button>
				<div class="profile-mini"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt=""><div><strong>Marina Costa</strong><span>@marinacosta</span></div></div>
			</aside>`;
	}
}

class LumeHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<header class="topbar">
				<div class="mobile-brand"><span class="brand-mark">l</span>lume</div>
				<label class="top-search"><span>⌕</span><input type="search" placeholder="Buscar pessoas, lugares..." aria-label="Buscar"></label>
				<div class="top-actions"><button class="icon-button" aria-label="Criar publicação" data-open-compose>＋</button><button class="icon-button" aria-label="Notificações">♡<i class="notification-dot"></i></button><img class="top-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Seu perfil"></div>
			</header>`;
	}
}

class LumeMobileNav extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `<nav class="mobile-nav" aria-label="Navegação móvel"><button aria-label="Início">⌂</button><button aria-label="Explorar">⌕</button><button class="mobile-create" aria-label="Criar publicação" data-open-compose>＋</button><button aria-label="Notificações">♡</button><button aria-label="Meu perfil">◉</button></nav>`;
	}
}

customElements.define('lume-sidebar', LumeSidebar);
customElements.define('lume-header', LumeHeader);
customElements.define('lume-mobile-nav', LumeMobileNav);