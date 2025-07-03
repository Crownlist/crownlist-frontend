/* eslint-disable */
type hookProps = () => {
  removeOrionKeys: () => void;
  removeLeoKeys: () => void;
  getOrionKeys: () => string | null;
  getLeoKeys: () => string | null;
};

export const useMgtKeys: hookProps = () => {
  const removeOrionKeys = () => {
    localStorage.getItem("orion") && localStorage.removeItem("orion");
    localStorage.getItem("orionKey") && localStorage.removeItem("orionKey");
    localStorage.getItem("orionLoop") && localStorage.removeItem("orionLoop");
  };

  const removeLeoKeys = () => {
    localStorage.getItem("leo") && localStorage.removeItem("leo");
    localStorage.getItem("leoKey") && localStorage.removeItem("leoKey");
    localStorage.getItem("leoLoop") && localStorage.removeItem("leoLoop");
  };

  const getOrionKeys = () => {
    const isStorePresent =
      localStorage.getItem("orion") &&
      localStorage.getItem("orionKey") &&
      localStorage.getItem("orionLoop");

    return isStorePresent;
  };

  const getLeoKeys = () => {
    const isUserPresent =
      localStorage.getItem("leo") &&
      localStorage.getItem("leoKey") &&
      localStorage.getItem("leoLoop");

    return isUserPresent;
  };

  return { removeOrionKeys, getOrionKeys, getLeoKeys, removeLeoKeys };
};
