<script lang="ts">
	import Delay from '$lib/Delay.svelte';
	import { flash } from '$lib/flash.js';
	import dorubako_tama from './img/dorubako_tama.png';
	import pome from './img/pome.png';
	type State = 'start' | 'adjusting' | 'game' | 'end';
	let state: State = 'start';
	let brightness: number = 50;
	let alpha = 0;
	let prevTime = 0;
	function updateAlpha() {
		alpha = Math.min(1, alpha + (Date.now() - prevTime) / 5000);
		prevTime = Date.now();
		if (alpha < 1) {
			requestAnimationFrame(updateAlpha);
		}
	}

	function startGame() {
		document.documentElement.requestFullscreen();
		setTimeout(() => {
			requestAnimationFrame(updateAlpha);
			prevTime = Date.now();
			state = 'game';
		}, 1000);
	}

	$: {
		if (state === 'game') {
			setTimeout(() => {
				state = 'end';
			}, 5000);
		}
	}
</script>

{#if state == 'start'}
	<main>
		<div transition:flash>
			<p>部屋を暗くしたら次へ進んでください</p>
			<Delay>
				<button on:click={() => (state = 'adjusting')}>
					次へ
					<i class="ti ti-chevron-right" />
				</button>
			</Delay>
		</div>
	</main>
{:else if state == 'adjusting'}
	<main>
		<div transition:flash>
			<div class="brightness-test">
				<img
					src={dorubako_tama}
					alt=""
					loading="eager"
					style="filter: brightness({brightness / 4}%);"
					class="brightness-test"
				/>
				<img
					src={dorubako_tama}
					alt=""
					loading="eager"
					style="filter: brightness({brightness * 2}%);"
					class="brightness-test"
				/>
			</div>
			<p>このスライダーを調節して</p>
			<p>左だけ見えなくなるまで調整してください</p>
			<input type="range" min="0" max="50" bind:value={brightness} />
			<i class="ti ti-arrow-left" />
			<Delay>
				<button on:click={startGame}>
					調節完了
					<i class="ti ti-chevron-right" />
				</button>
			</Delay>
		</div>
	</main>
{:else if state == 'game'}
	<main>
		<div>
			<img
				src={pome}
				alt=""
				loading="eager"
				class="pome"
				style="filter: brightness({brightness + 40}%) opacity({alpha})"
			/>
		</div>
	</main>
{:else if state == 'end'}
	<main>
		<div transition:flash>
			<p>今見えたものはあなたの本来の姿。</p>
			<p>何が見えましたか？</p>
			<Delay delay={2000}>
				<button on:click={() => (state = 'start')}>
					もう一度
					<i class="ti ti-chevron-right" />
				</button>
			</Delay>
		</div>
	</main>
{/if}

<style lang="scss">
	:global(body) {
		background-color: #000;
		color: #444;
		font-weight: 600;
	}

	main {
		position: fixed;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		text-shadow: 0px 3px 0px #181818;
	}

	.pome {
		height: 50vh;
		background: radial-gradient(circle at 50% 50%, transparent 010%, black 100%);
	}

	button {
		height: 50px;
		width: 200px;
		background: #000;
		color: #fff;
		border: 1px solid #fff;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	p {
		text-shadow: 0px 6px 0px #181818;
		filter: blur(1.5px);
	}

	input[type='range'] {
		height: 53px;
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		background: #000;
	}

	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		background: #222;
		border-radius: 13px;
		border: 1px solid #000;
	}

	input[type='range']::-webkit-slider-thumb {
		border: 4px solid #000;
		height: 25px;
		width: 26px;
		border-radius: 6px;
		background: #666;
		cursor: pointer;
		-webkit-appearance: none;
		margin-top: -8px;
	}

	.flex {
		display: flex;
	}

	.brightness-test {
		display: flex;
		flex-direction: row;

		> img {
			width: 200px;
			height: 200px;
		}
	}
</style>
