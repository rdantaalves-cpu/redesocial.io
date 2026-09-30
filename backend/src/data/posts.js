export function createDemoPosts() {
	return [
		{
			id: 'paraty-01',
			username: 'ana.lima',
			location: 'Paraty, Rio de Janeiro',
			avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=80',
			image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=88',
			imageAlt: 'Praia tranquila com mar azul e barcos coloridos',
			caption: 'Um lugar para esquecer a pressa e lembrar do que importa.',
			tags: ['#diasdecalma'],
			likes: 284,
			comments: 18,
			time: 'Há 24 minutos',
			verified: true
		},
		{
			id: 'serra-02',
			username: 'pedro.alves',
			location: 'Serra da Mantiqueira',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
			image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=88',
			imageAlt: 'Lago refletindo montanhas cobertas por floresta',
			caption: 'Acordar cedo vale a pena, às vezes.',
			tags: [],
			likes: 531,
			comments: 32,
			time: 'Há 1 hora',
			verified: false
		}
	];
}