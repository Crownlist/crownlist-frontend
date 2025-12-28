/* eslint-disable */
type hookProps = () => {
  removeOrionKeys: () => void;
  removeLeoKeys: () => void;
  getOrionKeys: () => boolean | string | null;
  getLeoKeys: () => boolean | string | null;
};

export const useMgtKeys: hookProps = () => {
  const removeOrionKeys = () => {
    // Remove all orion-related keys (no need to check if they exist first)
    localStorage.removeItem("orion");
    localStorage.removeItem("orionKey");
    localStorage.removeItem("orionLoop");
  };

  const removeLeoKeys = () => {
    // Remove all leo-related keys (no need to check if they exist first)
    localStorage.removeItem("leo");
    localStorage.removeItem("leoKey");
    localStorage.removeItem("leoLoop");
    localStorage.removeItem("leoName");
    localStorage.removeItem("leoAccountType");
  };

  const getOrionKeys = () => {
    if (typeof window === "undefined") return false;
    const isStorePresent =
      localStorage.getItem("orion") &&
      localStorage.getItem("orionKey") &&
      localStorage.getItem("orionLoop");

    return isStorePresent;
  };

  const getLeoKeys = () => {
    if (typeof window === "undefined") return false;
    const isUserPresent =
      localStorage.getItem("leo") &&
      localStorage.getItem("leoKey") &&
      localStorage.getItem("leoLoop");

    return isUserPresent;
  };

  return { removeOrionKeys, getOrionKeys, getLeoKeys, removeLeoKeys };
};
