import { ref, onScopeDispose } from "vue";

export function useMediaQuery(query: string) {
  const media = window.matchMedia(query);

  const matches = ref(media.matches);

  const update = () => {
    matches.value = media.matches;
  };

  media.addEventListener("change", update);

  onScopeDispose(() => media.removeEventListener("change", update));

  return matches;
}
