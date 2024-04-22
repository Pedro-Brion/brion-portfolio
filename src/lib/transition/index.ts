import { useDark } from "@vueuse/core";
import { nextTick } from "vue";

export const isDark = useDark({
  selector: "body",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
});
export const toggleDark = (event: MouseEvent) => {
  // @ts-expect-error experimental API
  // Fallback for browsers that don’t support this API:
  if (!document.startViewTransition) {
    isDark.value = !isDark.value;
    return;
  }

  // Get the click position, or fallback to the middle of the screen
  const x = event?.clientX ?? innerWidth / 2;
  const y = event?.clientY ?? innerHeight / 2;
  // Get the distance to the furthest corner
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  // Create a transition:
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });

  // Wait for the pseudo-elements to be created:
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 600,
        easing: "cubic-bezier(0.42, 0, 0.58, 1)",
        pseudoElement: isDark.value
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      }
    );
  });
};
