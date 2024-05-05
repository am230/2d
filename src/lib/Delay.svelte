<script lang="ts">
	export let delay = 1000;
	let visible = false;

	setTimeout(() => {
		visible = true;
	}, delay);
</script>

<div class:visible>
	<slot />
</div>

<style lang="scss">
	div {
		opacity: 0;
		transform: scaleY(0);
		transition:
			opacity 0.5s,
			transform 0.2s;
	}

	.visible {
		opacity: 1;
		transform: scaleY(1);
	}
</style>
