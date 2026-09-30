export function createCameraScene(THREE, canvas, onReady) {
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
	renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
	renderer.outputColorSpace = THREE.SRGBColorSpace;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(34, canvas.clientWidth / canvas.clientHeight, 0.1, 20);
	camera.position.set(0, 0, 4.6);
	const cameraModel = new THREE.Group();
	scene.add(cameraModel);
	scene.add(new THREE.HemisphereLight(0xf4ffd8, 0x173628, 2.2));
	const keyLight = new THREE.DirectionalLight(0xffffff, 3.3);
	keyLight.position.set(-2, 3, 4);
	scene.add(keyLight);
	const fillLight = new THREE.PointLight(0xd9f16d, 10, 8);
	fillLight.position.set(2, -1, 3);
	scene.add(fillLight);

	const housingMaterial = new THREE.MeshStandardMaterial({ color: 0x275d45, roughness: 0.32, metalness: 0.22 });
	const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x19362b, roughness: 0.27, metalness: 0.4 });
	const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x72bba1, roughness: 0.13, metalness: 0.48, emissive: 0x102d27 });
	const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xd9f16d, roughness: 0.28, metalness: 0.2 });
	cameraModel.add(new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.89, 0.48), housingMaterial));

	const viewfinder = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 0.4), darkMaterial);
	viewfinder.position.set(-0.26, 0.54, -0.01);
	cameraModel.add(viewfinder);
	const flash = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.12, 0.12), accentMaterial);
	flash.position.set(0.44, 0.52, 0.12);
	cameraModel.add(flash);

	[
		{ radius: 0.4, depth: 0.12, z: 0.26, material: darkMaterial },
		{ radius: 0.32, depth: 0.1, z: 0.34, material: accentMaterial },
		{ radius: 0.25, depth: 0.1, z: 0.41, material: darkMaterial },
		{ radius: 0.17, depth: 0.06, z: 0.48, material: lensMaterial }
	].forEach(layer => {
		const lens = new THREE.Mesh(new THREE.CylinderGeometry(layer.radius, layer.radius, layer.depth, 40), layer.material);
		lens.rotation.x = Math.PI / 2;
		lens.position.z = layer.z;
		cameraModel.add(lens);
	});

	const lensHighlight = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.018, 8, 32), new THREE.MeshStandardMaterial({ color: 0xd9f16d, emissive: 0x344814, roughness: 0.25 }));
	lensHighlight.position.set(-0.035, 0.045, 0.525);
	cameraModel.add(lensHighlight);
	const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.08, 24), accentMaterial);
	shutter.rotation.x = Math.PI / 2;
	shutter.position.set(0.47, 0.56, 0.22);
	cameraModel.add(shutter);
	const strap = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.028, 8, 28), accentMaterial);
	strap.rotation.y = Math.PI / 2;
	strap.position.set(-0.72, -0.02, -0.08);
	cameraModel.add(strap);

	let animationEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let rotationX = 0;
	let rotationY = 0;
	let targetX = 0;
	let targetY = 0;
	let pointerDown = false;
	let pointerMoved = false;
	let previousX = 0;
	let previousY = 0;
	let frame = 0;
	let ready = false;
	const clock = new THREE.Clock();
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	function render() {
		frame = 0;
		const elapsed = clock.getElapsedTime();
		const easing = reducedMotion.matches ? 1 : 0.08;
		rotationX += (targetX - rotationX) * easing;
		rotationY += (targetY - rotationY) * easing;
		cameraModel.rotation.x = rotationX + (animationEnabled ? Math.sin(elapsed * 0.9) * 0.035 : 0);
		cameraModel.rotation.y = rotationY + (animationEnabled ? Math.sin(elapsed * 0.55) * 0.12 : 0);
		cameraModel.position.y = animationEnabled ? Math.sin(elapsed * 1.3) * 0.045 : 0;
		renderer.render(scene, camera);
		if (!ready) {
			ready = true;
			onReady();
		}
		if (animationEnabled || Math.abs(targetX - rotationX) > 0.002 || Math.abs(targetY - rotationY) > 0.002) requestRender();
	}

	function requestRender() {
		if (!frame) frame = requestAnimationFrame(render);
	}

	function renderInteraction() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		render();
	}

	canvas.addEventListener('pointerdown', event => {
		pointerDown = true;
		pointerMoved = false;
		previousX = event.clientX;
		previousY = event.clientY;
		canvas.setPointerCapture(event.pointerId);
	});
	canvas.addEventListener('pointermove', event => {
		if (pointerDown) {
			const deltaX = event.clientX - previousX;
			const deltaY = event.clientY - previousY;
			if (Math.abs(deltaX) + Math.abs(deltaY) > 3) pointerMoved = true;
			targetY += deltaX * 0.012;
			targetX += deltaY * 0.009;
			previousX = event.clientX;
			previousY = event.clientY;
		} else {
			const bounds = canvas.getBoundingClientRect();
			targetY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.8;
			targetX = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.45;
		}
		if (reducedMotion.matches) renderInteraction();
		else requestRender();
	});
	canvas.addEventListener('pointerup', () => { pointerDown = false; });
	canvas.addEventListener('pointercancel', () => { pointerDown = false; });
	canvas.addEventListener('pointerleave', () => {
		if (!pointerDown) {
			targetX = 0;
			targetY = 0;
			if (reducedMotion.matches) renderInteraction();
			else requestRender();
		}
	});

	const resizeObserver = new ResizeObserver(() => {
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		requestRender();
	});
	resizeObserver.observe(canvas);
	reducedMotion.addEventListener('change', event => {
		animationEnabled = !event.matches;
		if (animationEnabled) requestRender();
		else renderInteraction();
	});
	render();

	return {
		toggleAnimation() {
			animationEnabled = !animationEnabled;
			if (animationEnabled) requestRender();
			else renderInteraction();
			return animationEnabled;
		},
		wasDragged() { return pointerMoved; },
		clearDrag() { pointerMoved = false; }
	};
}
