import tilesData from "../components/tiles.json";

const tileTypes = Object.keys(tilesData);

export const getNDuplicatedElements = (n) => {
  const types = tileTypes.slice(0, n);
  const duplicatedTypes = types.reduce(
    (acc, element) => acc.concat([element, element]),
    []
  );
  return duplicatedTypes.sort(() => 0.5 - Math.random());
};
