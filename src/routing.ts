export const getRoutingHash = () =>
  window ? window.location.hash.replace("#", "") : undefined;
export const setRoutingHash = (hashValue: string) => {
  if (window) window.location.hash = hashValue;
};
export const addHashChangeListener = (fn: EventListener) => {
  if (window) {
    window.addEventListener("onhashchange", fn);
  }
};
export const removeHashChangeListener = (fn: EventListener) => {
  if (window) {
    window.removeEventListener("onhashchange", fn);
  }
};
