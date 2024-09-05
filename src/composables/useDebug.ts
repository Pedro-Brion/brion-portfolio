import { useEventListener } from "@vueuse/core";
import { ref } from "vue";

export function useDebug() {
  const debugVisibility = ref<boolean>(false);
  const debugMode = ref<boolean>(false);

  const code = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let codePointer = 0;
  let previousTimeStamp = 0;

  useEventListener(document, "keydown", (evt) => {
    if (!previousTimeStamp) previousTimeStamp = evt.timeStamp;
    else {
      if (evt.timeStamp - previousTimeStamp > 1000) codePointer = 0;
      previousTimeStamp = evt.timeStamp;
    }
    if (evt.key === code[codePointer]) {
      codePointer = codePointer + 1;
      if (codePointer === code.length) {
        debugVisibility.value = true;
        codePointer = 0;
      }
    } else codePointer = 0;
  });

  return { debugVisibility, debugMode };
}
