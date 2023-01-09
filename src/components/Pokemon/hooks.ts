import { genAtom } from '@/components/Pokemon';
import { useAtom } from 'jotai';
import { uniq, uniqBy } from 'lodash';
import pokemondb from './fixtures/pokestats.json';
import poketypes from './fixtures/types.json';

const NON_FAIRY_GEN = [
  'red-blue-yellow',
  'firered-leafgreen',
  'gold-silver-crystal',
  'heartgold-soulsilver',
  'ruby-sapphire-emerald',
  'diamond-pearl',
  'platinum',
  'black-white',
  'black-white-2',
];

type RawPoketypes = {
  name: string;
  immunes: string[];
  strengths: string[];
  weaknesses: string[];
};

export function useGenerations() {
  return uniq(
    pokemondb.reduce((acc, i) => uniq([...acc, ...i.generation]), [] as string[])
  );
}

export type SelectedPokemon = {
  generation?: string[];
  number?: number | null;
  url?: string;
  name: string | null;
  types: PokemonTypes[];
  sprite: string | null;
  total_stats?: {
    Total: string;
    HP: string;
    Attack: string;
    Defense: string;
    'Sp. Atk': string;
    'Sp. Def': string;
    Speed: string;
  };
};

export const usePokeData = (): {
  pokeNames: string[];
  pokeTypes: PokemonTypes[];
  _pokedb: SelectedPokemon[];
  _poketypes: RawPoketypes[];
} => {
  const [chosenGen] = useAtom(genAtom);

  return {
    pokeNames: pokemondb.reduce((acc, p) => {
      if (chosenGen === '' || p.generation.includes(chosenGen)) return [...acc, p.name];
      return acc;
    }, [] as string[]),
    pokeTypes: poketypes.reduce((acc, p) => {
      if (NON_FAIRY_GEN.includes(chosenGen) && p.name === 'fairy') return acc;
      return [...acc, p.name as PokemonTypes];
    }, [] as PokemonTypes[]),
    _pokedb: pokemondb.reduce((acc, p) => {
      if (chosenGen === '' || p.generation.includes(chosenGen))
        return [...acc, p as SelectedPokemon];
      return acc;
    }, [] as SelectedPokemon[]),
    _poketypes: poketypes.reduce((acc, p) => {
      if (NON_FAIRY_GEN.includes(chosenGen) && p.name === 'fairy') return acc;
      return [...acc, p as RawPoketypes];
    }, [] as RawPoketypes[]),
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

export const useRecommended = (selection: Record<string, SelectedPokemon>) => {
  const { _poketypes, _pokedb } = usePokeData();

  let remainingTypes = _poketypes.map((pt) => pt.name) as PokemonTypes[];

  Object.keys(selection).forEach((index) => {
    let pokemon = selection[index];
    (_pokedb.find((p) => pokemon.name === p.name)?.types || []).forEach((t) => {
      let strengths = _poketypes.find((p) => p.name === t)?.strengths || [];
      remainingTypes = remainingTypes.filter((t) => !strengths.includes(t));
    });
  });
  remainingTypes = uniq(remainingTypes);

  let allRecommendedPokemon =
    remainingTypes.length === 0
      ? []
      : _pokedb
          .filter((p) => {
            let strengths = getStrengths(p.types);
            return remainingTypes.some((rt) => strengths.includes(rt));
          })
          .sort((a, b) => {
            let aCov = typeCoverage(remainingTypes, a.types);
            let bCov = typeCoverage(remainingTypes, b.types);
            let aTotal = parseInt(a.total_stats!.Total);
            let bTotal = parseInt(b.total_stats!.Total);
            if (bCov < aCov) return -1;
            if (bCov > aCov) return 1;
            if (bTotal < aTotal) return -1;
            if (bTotal > aTotal) return 1;
            return 0;
          });

  let recommendedPokemon = chunker(uniqBy(allRecommendedPokemon, 'name'));

  return { recommendedPokemon, remainingTypes };
};

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
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export const colorMap: Record<PokemonTypes, string | undefined> = {
  normal: undefined,
  fire: 'red',
  water: 'blue',
  electric: 'yellow',
  grass: 'green',
  ice: 'aqua',
  fighting: 'chocolate',
  poison: 'blueviolet',
  ground: 'brown',
  flying: 'bisue',
  psychic: 'deeppink',
  bug: 'darkolivegreen',
  rock: 'firebrick',
  ghost: 'indigo',
  dragon: 'slateblue',
  dark: 'darkslategrey',
  steel: 'darkgrey',
  fairy: 'fuchsia',
};
