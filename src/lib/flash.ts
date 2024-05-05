import { linear } from "svelte/easing";

export function flash(node: HTMLElement, { delay = 0, duration = 100, easing = linear } = {}) {
    function css(t: number) {
        return `filter: brightness(${2 - t})`;
    }
    return {
        delay,
        duration,
        easing,
        css,
    };
}
