import * as THREE from 'three';

const sculptures = [
	{ title: 'Pulso', note: 'uma ideia acende', color: 0x275d45, geometry: scene => new THREE.IcosahedronGeometry(0.37, 2), material: 'glass' },
	{ title: 'Órbita', note: 'encontre seu ritmo', color: 0xe87961, geometry: scene => new THREE.TorusKnotGeometry(0.29, 0.095, 96, 12, 2, 3), material: 'metal' },
	{ title: 'Ponto de vista', note: 'mude o ângulo', color: 0x9b7a37, geometry: scene => new THREE.OctahedronGeometry(0.38, 1), material: 'matte' },
	{ title: 'Encontro', note: 'mundos se aproximam', color: 0x884f67, geometry: scene => new THREE.TorusGeometry(0.3, 0.105, 16, 64), material: 'metal' },
	{ title: 'Sinal', note: 'deixe sua marca', color: 0x528d7e, geometry: scene => new THREE.TorusKnotGeometry(0.28, 0.07, 84, 10, 3, 4), material: 'glass' }
];

class LumeOrbitGallery extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<section class="orbit-gallery" aria-label="Galeria de objetos 3D interativos">
				<div class="orbit-copy"><div><p>PEQUENOS UNIVERSOS, GRANDES IDEIAS</p><h2>O que chama seu olhar?</h2></div><span>Uma coleção em movimento</span></div>
				<div class="orbit-fallback" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
				<canvas class="orbit-stage" aria-label="Cinco objetos tridimensionais interativos. Mova o cursor ou arraste para explorar."></canvas>
				<p class="orbit-hint">Mova o cursor para explorar ↗</p>
			</section>`;
		this.loadScene();
	}

	async loadScene() {
		const canvas = this.querySelector('canvas');
		try {
			this.sceneControls = this.createScene(canvas, this);
			this.classList.add('ready');
			this.setAttribute('data-3d-count', String(sculptures.length));
			this.bindPointer(canvas);
		} catch (error) {
			console.warn('A galeria 3D não pôde ser carregada; a versão ilustrada continua disponível.', error);
		}
	}

	createScene(canvas, gallery) {
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
		camera.position.set(0, 0, 6.5);
		scene.add(new THREE.HemisphereLight(0xf5f7dd, 0x586656, 2.1));
		const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
		keyLight.position.set(-2, 3, 5);
		scene.add(keyLight);
		const rimLight = new THREE.PointLight(0xe87961, 15, 10);
		rimLight.position.set(3, -1, 2);
		scene.add(rimLight);

		const galleryItems = sculptures.map((item, index) => {
			const materialOptions = {
				color: item.color,
				metalness: item.material === 'metal' ? 0.78 : 0.24,
				roughness: item.material === 'glass' ? 0.19 : 0.34,
				clearcoat: item.material === 'glass' ? 0.9 : 0.25,
				clearcoatRoughness: 0.2
			};
			const material = new THREE.MeshPhysicalMaterial(materialOptions);
			const mesh = new THREE.Mesh(item.geometry(THREE), material);
			mesh.position.x = (index - 2) * 1.15;
			mesh.position.y = index % 2 ? -0.12 : 0.03;
			mesh.rotation.set(0.2 * index, 0.33 * index, -0.12 * index);
			mesh.userData.baseX = mesh.position.x;
			mesh.userData.baseY = mesh.position.y;
			mesh.userData.baseZ = 0;
			mesh.userData.baseRotationX = mesh.rotation.x;
			mesh.userData.baseRotationY = mesh.rotation.y;
			mesh.userData.index = index;
			scene.add(mesh);
			return mesh;
		});

		let pointerX = 0;
		let pointerY = 0;
		let targetX = 0;
		let targetY = 0;
		let dragging = false;
		let previousX = 0;
		let previousY = 0;
		let frame = 0;
		let active = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const clock = new THREE.Clock();
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		const render = () => {
			frame = 0;
			const time = clock.getElapsedTime();
			pointerX += (targetX - pointerX) * (motionQuery.matches ? 0.3 : 0.075);
			pointerY += (targetY - pointerY) * (motionQuery.matches ? 0.3 : 0.075);
			galleryItems.forEach(mesh => {
				const index = mesh.userData.index;
				const parallax = 0.18 + index * 0.065;
				mesh.position.x = mesh.userData.baseX + pointerX * parallax;
				mesh.position.y = mesh.userData.baseY - pointerY * parallax + (active ? Math.sin(time * 0.8 + index * 1.4) * 0.055 : 0);
				mesh.rotation.x = mesh.userData.baseRotationX + pointerY * 0.48 * (index % 2 ? -1 : 1);
				mesh.rotation.y = mesh.userData.baseRotationY + pointerX * (0.45 + index * 0.08) + (active ? Math.sin(time * 0.5 + index) * 0.04 : 0);
				mesh.rotation.z = pointerX * pointerY * (index - 2) * 0.2;
				mesh.position.z = Math.max(-0.35, Math.min(0.35, pointerX * (index - 2) * 0.14));
			});
			renderer.render(scene, camera);
			if (active || Math.abs(targetX - pointerX) > 0.002 || Math.abs(targetY - pointerY) > 0.002) requestRender();
		};

		const requestRender = () => {
			if (!frame) frame = requestAnimationFrame(render);
		};
		const renderInteraction = () => {
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
			render();
		};
		const resizeObserver = new ResizeObserver(() => {
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			if (!width || !height) return;
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.position.z = width < 480 ? 7.8 : width < 760 ? 7.1 : 6.5;
			camera.updateProjectionMatrix();
			requestRender();
		});
		resizeObserver.observe(canvas);
		motionQuery.addEventListener('change', event => {
			active = !event.matches;
			if (active) requestRender();
			else renderInteraction();
		});
		render();

		return {
			move(x, y) {
				targetX = x;
				targetY = y;
				gallery.dataset.cursorX = x.toFixed(2);
				gallery.dataset.cursorY = y.toFixed(2);
				if (motionQuery.matches) renderInteraction();
				else requestRender();
			},
			startDrag(x, y) {
				dragging = true;
				previousX = x;
				previousY = y;
			},
			drag(x, y) {
				if (!dragging) return;
				targetX = Math.max(-1, Math.min(1, targetX + (x - previousX) / 180));
				targetY = Math.max(-1, Math.min(1, targetY + (y - previousY) / 130));
				previousX = x;
				previousY = y;
				if (motionQuery.matches) renderInteraction();
				else requestRender();
			},
			endDrag() { dragging = false; }
		};
	}

	bindPointer(canvas) {
		const moveFromPointer = event => {
			const bounds = canvas.getBoundingClientRect();
			const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
			const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
			this.sceneControls.move(x, y);
		};
		canvas.addEventListener('pointermove', event => {
			if (event.pointerType === 'mouse') moveFromPointer(event);
			else this.sceneControls.drag(event.clientX, event.clientY);
		});
		canvas.addEventListener('pointerdown', event => {
			if (event.pointerType === 'mouse') return;
			this.sceneControls.startDrag(event.clientX, event.clientY);
		});
		canvas.addEventListener('pointerup', () => this.sceneControls.endDrag());
		canvas.addEventListener('pointercancel', () => this.sceneControls.endDrag());
		canvas.addEventListener('pointerleave', () => this.sceneControls.move(0, 0));
		this.addEventListener('pointermove', event => {
			if (event.pointerType !== 'mouse' || event.target === canvas) return;
			moveFromPointer(event);
		});
		this.addEventListener('pointerleave', () => this.sceneControls.move(0, 0));
	}
}

customElements.define('lume-orbit-gallery', LumeOrbitGallery);