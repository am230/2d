<script lang="ts">
	import { onMount } from 'svelte';
	import img1 from './img/1.png';
	import img2 from './img/2.png';
	import img3 from './img/3.png';
	import img4 from './img/4.png';
	import img5 from './img/5.png';
	import img6 from './img/6.png';

	const images = [img1, img2, img3, img4, img5, img6];
	type Vec2 = { x: number; y: number };
	type Layer = {
		src: string;
		z: number;
		pos: Vec2;
		scale: number;
	};
	let layers: Layer[] = images.map((src, i) => ({
		src,
		z: i * 2,
		pos: {
			x: 0,
			y: 0,
		},
		scale: i / 15 + 1,
	}));

	function getOffset(value: number) {
		const length = Math.abs(value);
		const sign = value < 0 ? -1 : 1;
		const offset = (Math.sqrt(length + 1) - 1) * sign;
		return -offset / 2;
	}

	let offset: Vec2 = { x: 0, y: 0 };
	let mouse: Vec2 = { x: 0, y: 0 };

	function lerp(a: number, b: number, n: number) {
		return (1 - n) * a + n * b;
	}

	function handleMouseMove(event: MouseEvent) {
		const { clientX, clientY } = event;
		mouse = { x: clientX, y: clientY };
	}

	function render() {
		offset.x = lerp(offset.x, mouse.x, 0.2);
		offset.y = lerp(offset.y, mouse.y, 0.2);
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		const offsetX = getOffset((offset.x - centerX) / centerX);
		const offsetY = getOffset((offset.y - centerY) / centerY);
		layers = layers.map((layer) => {
			const x = offsetX * 10 * (7 - layer.z);
			const y = offsetY * 10 * (7 - layer.z);
			return {
				...layer,
				pos: { x, y },
			};
		});
	}

	let renderHandle: number;

	onMount(() => {
		renderHandle = requestAnimationFrame(function loop() {
			render();
			renderHandle = requestAnimationFrame(loop);
		});

		return () => cancelAnimationFrame(renderHandle);
	});
</script>

<svelte:window on:mousemove={handleMouseMove} on:pointermove={handleMouseMove} />
<main>
	{#each layers as layer, i}
		<img
			src={layer.src}
			style={`transform: translate(${layer.pos.x}%, ${layer.pos.y}%) scale(${layer.scale}); opacity: calc(1 / calc(${layer.z} * 0.003 + 1)); z-index: {i};`}
			alt={`Layer ${i}`}
		/>
	{/each}
</main>
<main class="reflection">
	{#each layers as layer, i}
		<img
			src={layer.src}
			style={`transform: translate(${layer.pos.x}%, ${layer.pos.y}%) scale(${layer.scale}); opacity: calc(1 / calc(${layer.z} * 0.003 + 1)); z-index: {i};`}
			alt={`Layer ${i}`}
		/>
	{/each}
</main>

<style lang="scss">
	:global(body) {
		background: #000;
	}

	main {
		$size: min(50vw, 50vh);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: $size;
		height: $size;
		outline: 3px solid #000;
		outline-offset: -1px;
		overflow: hidden;
		background: #fff;
	}

	.reflection {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 25%) rotateX(180deg) scaleY(0.5);
		opacity: 0.04;
	}

	img {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: cover;
		user-select: none;
		pointer-events: none;
	}
</style>
