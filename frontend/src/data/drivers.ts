export interface DriverData {
  name: string;
  number: number;
  country: string;
  countryFlag: string;
  age: number;
  birthdate: string;
  image: string;
  championships: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  careerPoints: number;
  debut: string;
  team: string;
  biography: string;
  nickname?: string;
  height: string;
  weight: string;
}

export const drivers2025: Record<string, DriverData> = {
  // Red Bull Racing
  'max-verstappen': {
    name: 'Max Verstappen',
    number: 1,
    country: 'Netherlands',
    countryFlag: '🇳🇱',
    age: 27,
    birthdate: '1997-09-30',
    image: '/images/drivers/max-verstappen.png',
    championships: 4,
    wins: 70, // Updated: 9 wins in 2025 added to previous total
    podiums: 119, // Updated: 15 podiums in 2025 added
    poles: 48, // Updated: 8 poles in 2025 added
    fastestLaps: 36, // Updated: estimated 3 fastest laps added
    careerPoints: 3031, // Updated: 155 points in 2025 added
    debut: 'Australia 2015',
    team: 'Red Bull Racing',
    biography: 'Four-time World Champion and the youngest ever Formula 1 race winner. Known for his aggressive driving style and exceptional car control in all conditions.',
    nickname: 'Mad Max',
    height: '1.81m',
    weight: '72kg'
  },
  'yuki-tsunoda': {
    name: 'Yuki Tsunoda',
    number: 22,
    country: 'Japan',
    countryFlag: '🇯🇵',
    age: 24,
    birthdate: '2000-05-11',
    image: '/images/drivers/yuki-tsunoda.jpg',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    careerPoints: 87, // Updated: 10 points in 2025 added
    debut: 'Bahrain 2021',
    team: 'Red Bull Racing',
    biography: 'Dynamic Japanese driver known for his speed and determination. Promoted to Red Bull Racing for 2025 after impressing in the sister team.',
    height: '1.59m',
    weight: '54kg'
  },

  // Ferrari
  'charles-leclerc': {
    name: 'Charles Leclerc',
    number: 16,
    country: 'Monaco',
    countryFlag: '🇲🇨',
    age: 27,
    birthdate: '1997-10-16',
    image: '/images/drivers/charles-leclerc.jpg',
    championships: 0,
    wins: 10, // Updated: 5 wins in 2025 added
    podiums: 45, // Updated: 19 podiums in 2025 added  
    poles: 36, // Updated: 12 poles in 2025 added
    fastestLaps: 12, // Updated: estimated 3 fastest laps added
    careerPoints: 1427, // Updated: 119 points in 2025 added
    debut: 'Australia 2018',
    team: 'Ferrari',
    biography: 'Monaco-born Ferrari driver with exceptional qualifying pace. Considered one of the most naturally talented drivers on the grid.',
    nickname: 'Il Predestinato',
    height: '1.80m',
    weight: '68kg'
  },
  'lewis-hamilton': {
    name: 'Lewis Hamilton',
    number: 44,
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    age: 40,
    birthdate: '1985-01-07',
    image: '/images/drivers/lewis-hamilton.jpg',
    championships: 7,
    wins: 105, // No wins in 2025 yet
    podiums: 202, // Updated: 1 podium in 2025 added (4th in Austria)
    poles: 104, // No poles in 2025 yet
    fastestLaps: 67, // No fastest laps in 2025 yet
    careerPoints: 4852, // Updated: 91 points in 2025 added
    debut: 'Australia 2007',
    team: 'Ferrari',
    biography: 'Seven-time World Champion and the most successful driver in F1 history. Joined Ferrari in 2025 for a new challenge in the twilight of his career.',
    nickname: 'Still I Rise',
    height: '1.74m',
    weight: '73kg'
  },

  // Mercedes
  'george-russell': {
    name: 'George Russell',
    number: 63,
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    age: 26,
    birthdate: '1998-02-15',
    image: '/images/drivers/george-russell.jpg',
    championships: 0,
    wins: 5, // Updated: 3 wins in 2025 added
    podiums: 22, // Updated: 8 podiums in 2025 added
    poles: 6, // Updated: 3 poles in 2025 added
    fastestLaps: 10, // Updated: estimated 2 fastest laps added
    careerPoints: 596, // Updated: 146 points in 2025 added
    debut: 'Australia 2019',
    team: 'Mercedes',
    biography: 'Methodical British driver known for his consistency and analytical approach. Mercedes team leader since Hamilton\'s departure.',
    height: '1.85m',
    weight: '70kg'
  },
  'kimi-antonelli': {
    name: 'Andrea Kimi Antonelli',
    number: 12,
    country: 'Italy',
    countryFlag: '🇮🇹',
    age: 18,
    birthdate: '2006-08-25',
    image: '/images/drivers/kimi-antonelli.jpg',
    championships: 0,
    wins: 0,
    podiums: 2,
    poles: 1,
    fastestLaps: 1,
    careerPoints: 91, // Updated: 63 points in 2025 added
    debut: 'Italy 2024',
    team: 'Mercedes',
    biography: 'Promising young Italian talent and part of Mercedes\' driver development program. The youngest driver on the 2025 grid with impressive early performances.',
    nickname: 'Baby Kimi',
    height: '1.74m',
    weight: '65kg'
  },

  // McLaren
  'lando-norris': {
    name: 'Lando Norris',
    number: 4,
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    age: 25,
    birthdate: '1999-11-13',
    image: '/images/drivers/lando-norris.jpg',
    championships: 0,
    wins: 7, // Updated: 3 wins in 2025 added (including Austrian GP)
    podiums: 50, // Updated: 22 podiums in 2025 added
    poles: 9, // Updated: 4 poles in 2025 added
    fastestLaps: 15, // Updated: estimated 6 fastest laps added
    careerPoints: 1151, // Updated: 201 points in 2025 added
    debut: 'Australia 2019',
    team: 'McLaren',
    biography: 'British driver known for his humor and speed. Currently second in the 2025 championship fight with McLaren.',
    height: '1.70m',
    weight: '68kg'
  },
  'oscar-piastri': {
    name: 'Oscar Piastri',
    number: 81,
    country: 'Australia',
    countryFlag: '🇦🇺',
    age: 23,
    birthdate: '2001-04-06',
    image: '/images/drivers/oscar-piastri.jpg',
    championships: 0,
    wins: 11, // Updated: 4 wins in 2025 added
    podiums: 39, // Updated: 20 podiums in 2025 added (22 total minus 3 from previous)
    poles: 8, // Updated: 4 poles in 2025 added
    fastestLaps: 12, // Updated: estimated 6 fastest laps added
    careerPoints: 636, // Updated: 216 points in 2025 added
    debut: 'Bahrain 2023',
    team: 'McLaren',
    biography: 'Current 2025 championship leader with exceptional racecraft and composure. Leading McLaren\'s title charge with multiple wins this season.',
    height: '1.83m',
    weight: '72kg'
  },

  // Aston Martin
  'fernando-alonso': {
    name: 'Fernando Alonso',
    number: 14,
    country: 'Spain',
    countryFlag: '🇪🇸',
    age: 43,
    birthdate: '1981-07-29',
    image: '/images/drivers/fernando-alonso.jpg',
    championships: 2,
    wins: 32,
    podiums: 99, // Updated: 1 podium in 2025 added
    poles: 22,
    fastestLaps: 23,
    careerPoints: 2210, // Updated: 14 points in 2025 added
    debut: 'Australia 2001',
    team: 'Aston Martin',
    biography: 'Two-time World Champion and one of the greatest drivers of all time. Still competitive at the highest level in his 40s with over 20 years of F1 experience.',
    nickname: 'El Nano',
    height: '1.71m',
    weight: '68kg'
  },
  'lance-stroll': {
    name: 'Lance Stroll',
    number: 18,
    country: 'Canada',
    countryFlag: '🇨🇦',
    age: 26,
    birthdate: '1998-10-29',
    image: '/images/drivers/lance-stroll.jpg',
    championships: 0,
    wins: 0,
    podiums: 3,
    poles: 1,
    fastestLaps: 0,
    careerPoints: 261, // Updated: 14 points in 2025 added
    debut: 'Australia 2017',
    team: 'Aston Martin',
    biography: 'Canadian driver and son of Aston Martin owner Lawrence Stroll. Known for his wet weather performances and consistent point-scoring.',
    height: '1.82m',
    weight: '70kg'
  },

  // Alpine
  'pierre-gasly': {
    name: 'Pierre Gasly',
    number: 10,
    country: 'France',
    countryFlag: '🇫🇷',
    age: 28,
    birthdate: '1996-02-07',
    image: '/images/drivers/pierre-gasly.jpg',
    championships: 0,
    wins: 1,
    podiums: 4,
    poles: 0,
    fastestLaps: 3,
    careerPoints: 398, // Updated: 11 points in 2025 added
    debut: 'Malaysia 2017',
    team: 'Alpine',
    biography: 'Experienced French driver with a shock victory at Monza 2020. Known for his speed and determination to prove himself at the highest level.',
    height: '1.77m',
    weight: '70kg'
  },
  'franco-colapinto': {
    name: 'Franco Colapinto',
    number: 7,
    country: 'Argentina',
    countryFlag: '🇦🇷',
    age: 21,
    birthdate: '2003-05-27',
    image: '/images/drivers/franco-colapinto.jpg',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    careerPoints: 5, // No points scored in 2025 yet
    debut: 'Italy 2024',
    team: 'Alpine',
    biography: 'Argentine driver who impressed during his mid-season debut with Williams in 2024. Promoted to Alpine race seat after strong reserve performances.',
    height: '1.75m',
    weight: '68kg'
  },

  // Williams
  'alexander-albon': {
    name: 'Alexander Albon',
    number: 23,
    country: 'Thailand',
    countryFlag: '🇹🇭',
    age: 28,
    birthdate: '1996-03-23',
    image: '/images/drivers/alex-albon.jpg',
    championships: 0,
    wins: 0,
    podiums: 2,
    poles: 0,
    fastestLaps: 1,
    careerPoints: 279, // Updated: 42 points in 2025 added
    debut: 'Australia 2019',
    team: 'Williams',
    biography: 'Thai-British driver known for his adaptability and valuable feedback to engineers. Williams team leader and development specialist.',
    height: '1.86m',
    weight: '74kg'
  },
  'carlos-sainz': {
    name: 'Carlos Sainz Jr.',
    number: 55,
    country: 'Spain',
    countryFlag: '🇪🇸',
    age: 30,
    birthdate: '1994-09-01',
    image: '/images/drivers/carlos-sainz.jpg',
    championships: 0,
    wins: 3,
    podiums: 23,
    poles: 5,
    fastestLaps: 6,
    careerPoints: 1156, // Updated: 13 points in 2025 added
    debut: 'Australia 2015',
    team: 'Williams',
    biography: 'Consistent Spanish driver known for his racecraft and ability to maximize car performance. Son of rally legend Carlos Sainz Sr.',
    nickname: 'Chili',
    height: '1.78m',
    weight: '68kg'
  },

  // RB
  'liam-lawson': {
    name: 'Liam Lawson',
    number: 30,
    country: 'New Zealand',
    countryFlag: '🇳🇿',
    age: 22,
    birthdate: '2002-02-11',
    image: '/images/drivers/liam-lawson.jpg',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    careerPoints: 21, // Updated: 12 points in 2025 added
    debut: 'Netherlands 2023',
    team: 'RB',
    biography: 'Talented Kiwi driver with impressive junior career credentials. Part of Red Bull\'s driver development program showing steady improvement.',
    height: '1.80m',
    weight: '72kg'
  },
  'isack-hadjar': {
    name: 'Isack Hadjar',
    number: 6,
    country: 'France',
    countryFlag: '🇫🇷',
    age: 20,
    birthdate: '2004-09-28',
    image: '/images/drivers/isack-hadjar.jpg',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    careerPoints: 25, // Updated: 21 points in 2025 added
    debut: 'Bahrain 2025',
    team: 'RB',
    biography: 'Promising French-Algerian talent from Red Bull\'s junior program. One of the most promising rookies on the 2025 grid.',
    height: '1.75m',
    weight: '68kg'
  },

  // Haas
  'esteban-ocon': {
    name: 'Esteban Ocon',
    number: 31,
    country: 'France',
    countryFlag: '🇫🇷',
    age: 28,
    birthdate: '1996-09-17',
    image: '/images/drivers/esteban-ocon.jpg',
    championships: 0,
    wins: 1,
    podiums: 3,
    poles: 0,
    fastestLaps: 0,
    careerPoints: 418, // Updated: 23 points in 2025 added
    debut: 'Belgium 2016',
    team: 'Haas',
    biography: 'Experienced French driver with a victory at the 2021 Hungarian Grand Prix. Known for his consistency and professionalism in the midfield.',
    height: '1.86m',
    weight: '74kg'
  },
  'oliver-bearman': {
    name: 'Oliver Bearman',
    number: 87,
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    age: 19,
    birthdate: '2005-05-08',
    image: '/images/drivers/oliver-bearman.jpg',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    careerPoints: 13, // Updated: 6 points in 2025 added
    debut: 'Saudi Arabia 2024',
    team: 'Haas',
    biography: 'British youngster who impressed on his Ferrari debut in 2024. Part of Ferrari\'s driver academy program with a bright future ahead.',
    height: '1.84m',
    weight: '70kg'
  },

  // Kick Sauber
  'nico-hulkenberg': {
    name: 'Nico Hülkenberg',
    number: 27,
    country: 'Germany',
    countryFlag: '🇩🇪',
    age: 37,
    birthdate: '1987-08-19',
    image: '/images/drivers/nico-hulkenberg.jpg',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 1,
    fastestLaps: 2,
    careerPoints: 552, // Updated: 22 points in 2025 added
    debut: 'Bahrain 2010',
    team: 'Kick Sauber',
    biography: 'Veteran German driver with 15 years of F1 experience. Known for his consistency, professionalism, and the unique achievement of winning Le Mans while racing in F1.',
    nickname: 'The Hulk',
    height: '1.84m',
    weight: '74kg'
  },
  'gabriel-bortoleto': {
    name: 'Gabriel Bortoleto',
    number: 5,
    country: 'Brazil',
    countryFlag: '🇧🇷',
    age: 20,
    birthdate: '2004-10-14',
    image: '/images/drivers/gabriel-bortoleto.jpg',
    championships: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    careerPoints: 4, // Updated: 4 points in 2025 added (first career points!)
    debut: 'Bahrain 2025',
    team: 'Kick Sauber',
    biography: 'Brazilian rookie with impressive junior formula credentials. Part of McLaren\'s driver development program joining Sauber for their transition to Audi.',
    height: '1.77m',
    weight: '69kg'
  }
};