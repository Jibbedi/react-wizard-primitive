export const getWindow = () => window;

export const getRoutingHash = () =>
  getWindow() ? getWindow().location.hash.replace("#", "") : undefined;
export const setRoutingHash = (hashValue: string) => {
  if (getWindow()) getWindow().location.hash = hashValue;
};
