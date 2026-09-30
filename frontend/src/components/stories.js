const storyItems = [
	{
		name: 'Sua história',
		image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
		story: 'Um começo tranquilo para o dia.',
		storyImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=85',
		seen: true
	},
	{
		name: 'analima',
		image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=80',
		story: 'Ana Lima',
		storyImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=85'
	},
	{
		name: 'pedro.alves',
		image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
		story: 'Pedro Alves',
		storyImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=85'
	},
	{
		name: 'bia.martins',
		image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80',
		story: 'Bia Martins',
		storyImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=85'
	},
	{
		name: 'rafanunes',
		image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
		story: 'Rafa Nunes',
		storyImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=85'
	},
	{
		name: 'clarasouza',
		image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
		story: 'Clara Souza',
		storyImage: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=85'
	},
	{
		name: 'lucasmelo',
		image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
		story: 'Lucas Melo',
		storyImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=85'
	}
];

class LumeStories extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `<div class="stories" aria-label="Stories">${storyItems.map(story => `
			<button class="story" data-story="${story.story}" data-image="${story.storyImage}">
				<span class="story-ring${story.seen ? ' seen' : ''}"><img src="${story.image}" alt=""></span>
				<span class="story-name">${story.name}</span>
			</button>`).join('')}
		</div>`;
	}
}

customElements.define('lume-stories', LumeStories);