import { graphql, HttpResponse } from 'msw';
import type { Character } from '@/types/character';

// Mock data para tests
export const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
      type: 'Planet',
      dimension: 'Replacement Dimension',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [
      {
        id: '1',
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
      },
    ],
    created: '2017-11-04T18:48:46.250Z',
  },
  {
    id: '2',
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
      type: 'Planet',
      dimension: 'Replacement Dimension',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: [
      {
        id: '1',
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
      },
    ],
    created: '2017-11-04T18:50:21.651Z',
  },
  {
    id: '3',
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Female',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
      type: 'Planet',
      dimension: 'Replacement Dimension',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    episode: [
      {
        id: '1',
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
      },
    ],
    created: '2017-11-04T19:09:56.428Z',
  },
];

export const handlers = [
  // Handler para GET_CHARACTERS
  graphql.query('GetCharacters', ({ variables }) => {
    const { page = 1, name, species, status, gender } = variables as {
      page?: number;
      name?: string;
      species?: string;
      status?: string;
      gender?: string;
    };

    let filteredCharacters = [...mockCharacters];

    // Apply filters
    if (name) {
      filteredCharacters = filteredCharacters.filter((char) =>
        char.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (species) {
      filteredCharacters = filteredCharacters.filter(
        (char) => char.species === species
      );
    }
    if (status) {
      filteredCharacters = filteredCharacters.filter(
        (char) => char.status === status
      );
    }
    if (gender) {
      filteredCharacters = filteredCharacters.filter(
        (char) => char.gender === gender
      );
    }

    return HttpResponse.json({
      data: {
        characters: {
          info: {
            count: filteredCharacters.length,
            pages: 1,
            next: null,
            prev: null,
          },
          results: filteredCharacters,
        },
      },
    });
  }),

  // Handler para GET_CHARACTER
  graphql.query('GetCharacter', ({ variables }) => {
    const { id } = variables as { id: string };
    const character = mockCharacters.find((char) => char.id === id);

    if (!character) {
      return HttpResponse.json({
        errors: [{ message: 'Character not found' }],
      });
    }

    return HttpResponse.json({
      data: {
        character,
      },
    });
  }),
];

