import { uniq } from 'lodash';
import pokemondb from './fixtures/pokemondb.json';
import poketypes from './fixtures/types.json';

export type SelectedPokemon = {
  generation: number;
  number: number | null;
  name: string | null;
  types: PokemonTypes[];
  sprite: string | null;
};

export const usePokeData = (): { pokeNames: string[]; pokeTypes: PokemonTypes[] } => {
  return {
    pokeNames: pokemondb.map((p) => p.name),
    pokeTypes: poketypes.map((p) => p.name) as PokemonTypes[],
  };
};

export function getPokemon(name: string | null) {
  return (pokemondb.find((p) => p.name === name) || {
    name: null,
    types: [],
    sprite: null,
  }) as SelectedPokemon;
}

function getStrengths(pTypes: PokemonTypes[]) {
  return uniq(
    poketypes.reduce((s, item, i) => {
      if (pTypes.includes(item.name as PokemonTypes)) {
        s = [...s, ...(item.strengths as PokemonTypes[])];
      }
      return s;
    }, [] as PokemonTypes[])
  );
}

function typeCoverage(remainingTypes: PokemonTypes[], pTypes: PokemonTypes[]) {
  let strengths = getStrengths(pTypes);
  return remainingTypes.reduce(
    (total, item) => (strengths.includes(item) ? 1 + total : total),
    0
  );
}

export function useRecommended(selection: Record<string, SelectedPokemon>) {
  let remainingTypes = poketypes.map((p) => p.name) as PokemonTypes[];
  Object.keys(selection).forEach((index) => {
    let pokemon = selection[index];
    (pokemondb.find((p) => pokemon.name === p.name)?.types || []).forEach((t) => {
      let strengths = poketypes.find((p) => p.name === t)?.strengths || [];
      remainingTypes = remainingTypes.filter((t) => !strengths.includes(t));
    });
  });
  remainingTypes = uniq(remainingTypes);

  let allRecommendedPokemon =
    remainingTypes.length === 0
      ? []
      : (pokemondb as SelectedPokemon[])
          .filter((p) => {
            let strengths = getStrengths(p.types);
            return remainingTypes.some((rt) => strengths.includes(rt));
          })
          .sort(
            (a, b) =>
              typeCoverage(remainingTypes, b.types) -
              typeCoverage(remainingTypes, a.types)
          );

  let recommendedPokemon = chunker(allRecommendedPokemon);

  return { recommendedPokemon, remainingTypes };
}

function chunker(stuff: SelectedPokemon[], chunksize = 15) {
  const result: SelectedPokemon[][] = stuff.reduce((res, item, index) => {
    const chunkIndex = Math.floor(index / chunksize);
    if (!res[chunkIndex]) {
      res[chunkIndex] = [];
    }
    res[chunkIndex].push(item);
    return res;
  }, [] as SelectedPokemon[][]);

  return result;
}

export type PokemonTypes =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy';

export const colorMap: Record<PokemonTypes, string | undefined> = {
  Normal: undefined,
  Fire: 'red',
  Water: 'blue',
  Electric: 'yellow',
  Grass: 'green',
  Ice: 'aqua',
  Fighting: 'chocolate',
  Poison: 'blueviolet',
  Ground: 'brown',
  Flying: 'bisue',
  Psychic: 'deeppink',
  Bug: 'darkolivegreen',
  Rock: 'firebrick',
  Ghost: 'indigo',
  Dragon: 'slateblue',
  Dark: 'darkslategrey',
  Steel: 'darkgrey',
  Fairy: 'fuchsia',
};
