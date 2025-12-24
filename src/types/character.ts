export interface Character {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Location;
  location: Location;
  image: string;
  episode: Episode[];
  created: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  dimension: string;
}

export interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
}

export interface CharactersResponse {
  characters: {
    info: PaginationInfo;
    results: Character[];
  };
}

export interface CharacterResponse {
  character: Character;
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface Comment {
  id: string;
  characterId: string;
  text: string;
  createdAt: string;
}

export type CharacterFilter = 'all' | 'starred' | 'others';
export type SpeciesFilter = 'all' | 'Human' | 'Alien';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  characterFilter: CharacterFilter;
  speciesFilter: SpeciesFilter;
  sortOrder: SortOrder;
}

