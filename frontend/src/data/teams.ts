export interface TeamData {
  id: string;
  name: string;
  fullName: string;
  shortName: string;
  founded: number;
  base: string;
  teamPrincipal: string;
  engine: string;
  chassis: string;
  color: string;
  secondaryColor: string;
  drivers: string[];
  carImage: string;
  teamLogo: string;
  championships: {
    constructors: number;
    drivers: number;
  };
  currentSeason: {
    position: number;
    points: number;
    wins: number;
    podiums: number;
    poles: number;
  };
  history: string;
  achievements: string[];
  website: string;
  socialMedia: {
    twitter: string;
    instagram: string;
    facebook: string;
  };
  headquarters: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  keyPersonnel: {
    teamPrincipal: string;
    technicalDirector: string;
    headOfAerodynamics: string;
    chiefEngineer: string;
  };
  carSpecs: {
    engine: string;
    transmission: string;
    wheels: string;
    brakes: string;
  };
}

export const teams2025: Record<string, TeamData> = {
  'red-bull': {
    id: 'red-bull',
    name: 'Oracle Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    shortName: 'Red Bull',
    founded: 2005,
    base: 'Milton Keynes, United Kingdom',
    teamPrincipal: 'Christian Horner',
    engine: 'Honda RBPT',
    chassis: 'RB21',
    color: '#0600EF',
    secondaryColor: '#DC143C',
    drivers: ['Max Verstappen', 'Yuki Tsunoda'],
    carImage: '/images/cars/red-bull-rb21.jpg',
    teamLogo: '/images/logos/red-bull-logo.png',
    championships: { constructors: 6, drivers: 7 },
    currentSeason: {
      position: 3,
      points: 589,
      wins: 9,
      podiums: 15,
      poles: 8
    },
    history: 'Originally founded as Stewart Grand Prix in 1997, the team was purchased by Red Bull in 2005. Under their ownership, Red Bull Racing has become one of the most successful teams in F1 history, winning multiple championships and establishing themselves as a dominant force in the sport.',
    achievements: [
      'Youngest driver to win a championship (Max Verstappen, 2021)',
      'Most wins in a single season (19 wins, 2023)',
      'First team to score over 860 points in a season',
      'Consecutive championship wins (2022-2024)'
    ],
    website: 'https://www.redbull.com/int-en/redbullracing',
    socialMedia: {
      twitter: '@redbullracing',
      instagram: '@redbullracing',
      facebook: 'Red Bull Racing'
    },
    headquarters: {
      address: 'Red Bull Racing, Bradbourne Drive, Tilbrook, Milton Keynes MK7 8BJ, UK',
      coordinates: { lat: 52.0406, lng: -0.7594 }
    },
    keyPersonnel: {
      teamPrincipal: 'Christian Horner',
      technicalDirector: 'Pierre Waché',
      headOfAerodynamics: 'Adrian Newey',
      chiefEngineer: 'Paul Monaghan'
    },
    carSpecs: {
      engine: 'Honda RBPT RA624H 1.6L V6 Turbo Hybrid',
      transmission: 'Red Bull Racing 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'ferrari': {
    id: 'ferrari',
    name: 'Scuderia Ferrari',
    fullName: 'Scuderia Ferrari',
    shortName: 'Ferrari',
    founded: 1929,
    base: 'Maranello, Italy',
    teamPrincipal: 'Frédéric Vasseur',
    engine: 'Ferrari',
    chassis: 'SF-25',
    color: '#DC0000',
    secondaryColor: '#FFF200',
    drivers: ['Charles Leclerc', 'Lewis Hamilton'],
    carImage: '/images/cars/ferrari-sf25.jpg',
    teamLogo: '/images/logos/ferrari-logo.png',
    championships: { constructors: 16, drivers: 15 },
    currentSeason: {
      position: 2,
      points: 652,
      wins: 5,
      podiums: 18,
      poles: 12
    },
    history: 'The oldest and most successful team in Formula 1 history. Founded by Enzo Ferrari, the Scuderia has been competing since the first F1 season in 1950. Known for their passionate fans, iconic red cars, and legendary drivers.',
    achievements: [
      'Most constructor championships (16)',
      'Most race wins in F1 history',
      'Only team to compete in every F1 season since 1950',
      'Home to legendary drivers like Schumacher, Lauda, and Alonso'
    ],
    website: 'https://www.ferrari.com/en/formula1',
    socialMedia: {
      twitter: '@scuderiaferrari',
      instagram: '@scuderiaferrari',
      facebook: 'Scuderia Ferrari'
    },
    headquarters: {
      address: 'Via Abetone Inferiore 4, 41053 Maranello MO, Italy',
      coordinates: { lat: 44.5326, lng: 10.8659 }
    },
    keyPersonnel: {
      teamPrincipal: 'Frédéric Vasseur',
      technicalDirector: 'Enrico Cardile',
      headOfAerodynamics: 'Diego Tondi',
      chiefEngineer: 'Jock Clear'
    },
    carSpecs: {
      engine: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
      transmission: 'Ferrari 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'mercedes': {
    id: 'mercedes',
    name: 'Mercedes-AMG Petronas F1 Team',
    fullName: 'Mercedes-AMG Petronas Formula One Team',
    shortName: 'Mercedes',
    founded: 1954,
    base: 'Brackley, United Kingdom',
    teamPrincipal: 'Toto Wolff',
    engine: 'Mercedes',
    chassis: 'W16',
    color: '#00D2BE',
    secondaryColor: '#000000',
    drivers: ['George Russell', 'Kimi Antonelli'],
    carImage: '/images/cars/mercedes-w16.jpg',
    teamLogo: '/images/logos/mercedes-logo.png',
    championships: { constructors: 8, drivers: 9 },
    currentSeason: {
      position: 4,
      points: 382,
      wins: 3,
      podiums: 8,
      poles: 3
    },
    history: 'Mercedes returned to F1 as a constructor in 2010 and dominated the hybrid era from 2014-2021. Known for technical excellence and strategic mastery under Toto Wolff\'s leadership.',
    achievements: [
      'Eight consecutive constructor championships (2014-2021)',
      'Lewis Hamilton\'s seven championships with the team',
      'Most dominant hybrid era performance',
      'Technical innovation leaders'
    ],
    website: 'https://www.mercedesamgf1.com',
    socialMedia: {
      twitter: '@MercedesAMGF1',
      instagram: '@mercedesamgf1',
      facebook: 'Mercedes-AMG Petronas Formula One Team'
    },
    headquarters: {
      address: 'Brackley Technology Centre, Brackley NN13 7BD, UK',
      coordinates: { lat: 52.0406, lng: -1.1469 }
    },
    keyPersonnel: {
      teamPrincipal: 'Toto Wolff',
      technicalDirector: 'Mike Elliott',
      headOfAerodynamics: 'Loic Bigois',
      chiefEngineer: 'Andrew Shovlin'
    },
    carSpecs: {
      engine: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
      transmission: 'Mercedes-AMG 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'mclaren': {
    id: 'mclaren',
    name: 'McLaren Formula 1 Team',
    fullName: 'McLaren Formula 1 Team',
    shortName: 'McLaren',
    founded: 1963,
    base: 'Woking, United Kingdom',
    teamPrincipal: 'Andrea Stella',
    engine: 'Mercedes',
    chassis: 'MCL39',
    color: '#FF8700',
    secondaryColor: '#000000',
    drivers: ['Lando Norris', 'Oscar Piastri'],
    carImage: '/images/cars/mclaren-mcl39.jpg',
    teamLogo: '/images/logos/mclaren-logo.png',
    championships: { constructors: 8, drivers: 12 },
    currentSeason: {
      position: 1,
      points: 666,
      wins: 6,
      podiums: 20,
      poles: 8
    },
    history: 'Founded by Bruce McLaren, the team has been a mainstay of F1 success. Famous for the McLaren-Honda partnership of the late 1980s and early 1990s with Ayrton Senna and Alain Prost.',
    achievements: [
      'Second most successful constructor in F1',
      'Ayrton Senna\'s legendary drives',
      '1988 season - 15 wins out of 16 races',
      'Current championship leaders (2024)'
    ],
    website: 'https://www.mclaren.com/racing/',
    socialMedia: {
      twitter: '@McLarenF1',
      instagram: '@mclarenf1',
      facebook: 'McLaren'
    },
    headquarters: {
      address: 'McLaren Technology Centre, Chertsey Road, Woking GU21 4YH, UK',
      coordinates: { lat: 51.3428, lng: -0.5579 }
    },
    keyPersonnel: {
      teamPrincipal: 'Andrea Stella',
      technicalDirector: 'Neil Houldey',
      headOfAerodynamics: 'Peter Prodromou',
      chiefEngineer: 'Tom Stallard'
    },
    carSpecs: {
      engine: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
      transmission: 'McLaren 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Akebono carbon fibre discs and pads'
    }
  },

  'aston-martin': {
    id: 'aston-martin',
    name: 'Aston Martin Aramco Formula One Team',
    fullName: 'Aston Martin Aramco Cognizant Formula One Team',
    shortName: 'Aston Martin',
    founded: 2021,
    base: 'Silverstone, United Kingdom',
    teamPrincipal: 'Mike Krack',
    engine: 'Mercedes',
    chassis: 'AMR25',
    color: '#006F62',
    secondaryColor: '#CEDC00',
    drivers: ['Fernando Alonso', 'Lance Stroll'],
    carImage: '/images/cars/aston-martin-amr25.jpg',
    teamLogo: '/images/logos/aston-martin-logo.png',
    championships: { constructors: 0, drivers: 0 },
    currentSeason: {
      position: 5,
      points: 94,
      wins: 0,
      podiums: 1,
      poles: 0
    },
    history: 'The team formerly known as Racing Point and Force India was rebranded as Aston Martin in 2021. Backed by Lawrence Stroll, the team has invested heavily in facilities and personnel.',
    achievements: [
      'Fastest development in recent F1 history',
      'New state-of-the-art factory at Silverstone',
      'Attracted top talent including Fernando Alonso',
      'Strong 2023 early season performance'
    ],
    website: 'https://www.astonmartinf1.com',
    socialMedia: {
      twitter: '@AstonMartinF1',
      instagram: '@astonmartinf1',
      facebook: 'Aston Martin Formula One Team'
    },
    headquarters: {
      address: 'Aston Martin Technology Campus, Dadford Road, Silverstone NN12 8TJ, UK',
      coordinates: { lat: 52.0719, lng: -1.0197 }
    },
    keyPersonnel: {
      teamPrincipal: 'Mike Krack',
      technicalDirector: 'Dan Fallows',
      headOfAerodynamics: 'Simon Turner',
      chiefEngineer: 'Tom McCullough'
    },
    carSpecs: {
      engine: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
      transmission: 'Mercedes-AMG 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'alpine': {
    id: 'alpine',
    name: 'BWT Alpine F1 Team',
    fullName: 'BWT Alpine F1 Team',
    shortName: 'Alpine',
    founded: 2021,
    base: 'Enstone, United Kingdom',
    teamPrincipal: 'Oliver Oakes',
    engine: 'Renault',
    chassis: 'A525',
    color: '#0090FF',
    secondaryColor: '#FF87BC',
    drivers: ['Pierre Gasly', 'Jack Doohan'],
    carImage: '/images/cars/alpine-a525.jpg',
    teamLogo: '/images/logos/alpine-logo.png',
    championships: { constructors: 2, drivers: 0 },
    currentSeason: {
      position: 6,
      points: 65,
      wins: 0,
      podiums: 0,
      poles: 0
    },
    history: 'Originally Renault, then Lotus, and now Alpine. The team has a rich history including championship success in the mid-2000s with Fernando Alonso.',
    achievements: [
      'Two constructor championships as Renault (2005-2006)',
      'Fernando Alonso\'s early championships',
      'Consistent midfield competitor',
      'French manufacturer representation'
    ],
    website: 'https://www.alpinef1team.com',
    socialMedia: {
      twitter: '@AlpineF1Team',
      instagram: '@alpinef1team',
      facebook: 'Alpine F1 Team'
    },
    headquarters: {
      address: 'Whiteways Technical Centre, Enstone OX7 4EE, UK',
      coordinates: { lat: 51.9239, lng: -1.3958 }
    },
    keyPersonnel: {
      teamPrincipal: 'Oliver Oakes',
      technicalDirector: 'Matt Harman',
      headOfAerodynamics: 'Dirk de Beer',
      chiefEngineer: 'Ciaron Pilbeam'
    },
    carSpecs: {
      engine: 'Renault E-Tech RE25 1.6L V6 Turbo Hybrid',
      transmission: 'Alpine 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'williams': {
    id: 'williams',
    name: 'Williams Racing',
    fullName: 'Atlassian Williams Racing',
    shortName: 'Williams',
    founded: 1977,
    base: 'Grove, United Kingdom',
    teamPrincipal: 'James Vowles',
    engine: 'Mercedes',
    chassis: 'FW47',
    color: '#005AFF',
    secondaryColor: '#FFFFFF',
    drivers: ['Alexander Albon', 'Carlos Sainz Jr.'],
    carImage: '/images/cars/williams-fw47.jpg',
    teamLogo: '/images/logos/williams-logo.png',
    championships: { constructors: 9, drivers: 7 },
    currentSeason: {
      position: 9,
      points: 17,
      wins: 0,
      podiums: 0,
      poles: 0
    },
    history: 'One of F1\'s most successful teams, founded by Sir Frank Williams. Dominated in the 1980s and 1990s with drivers like Nigel Mansell, Damon Hill, and Jacques Villeneuve.',
    achievements: [
      'Nine constructor championships',
      'Seven driver championships',
      'Most wins by an independent team',
      'Legendary status in F1 history'
    ],
    website: 'https://www.williamsf1.com',
    socialMedia: {
      twitter: '@WilliamsRacing',
      instagram: '@williamsracing',
      facebook: 'Williams Racing'
    },
    headquarters: {
      address: 'Williams Conference Centre, Grove, Wantage OX12 0DQ, UK',
      coordinates: { lat: 51.6167, lng: -1.4167 }
    },
    keyPersonnel: {
      teamPrincipal: 'James Vowles',
      technicalDirector: 'Pat Fry',
      headOfAerodynamics: 'Juan Fernandez',
      chiefEngineer: 'Dave Robson'
    },
    carSpecs: {
      engine: 'Mercedes-AMG M15 E Performance 1.6L V6 Turbo Hybrid',
      transmission: 'Williams 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'rb': {
    id: 'rb',
    name: 'Visa Cash App RB Formula One Team',
    fullName: 'Visa Cash App RB Formula One Team',
    shortName: 'RB',
    founded: 2020,
    base: 'Faenza, Italy',
    teamPrincipal: 'Laurent Mekies',
    engine: 'Honda RBPT',
    chassis: 'VCARB 01',
    color: '#6692FF',
    secondaryColor: '#C8102E',
    drivers: ['Liam Lawson', 'Isack Hadjar'],
    carImage: '/images/cars/rb-vcarb01.jpg',
    teamLogo: '/images/logos/rb-logo.png',
    championships: { constructors: 1, drivers: 0 },
    currentSeason: {
      position: 8,
      points: 46,
      wins: 0,
      podiums: 0,
      poles: 0
    },
    history: 'Red Bull\'s sister team, formerly known as Toro Rosso and AlphaTauri. Serves as a development team for young drivers in the Red Bull program.',
    achievements: [
      'Sebastian Vettel\'s first win (2008)',
      'Pierre Gasly\'s shock win at Monza (2020)',
      'Successful driver development program',
      'Consistent points scorer'
    ],
    website: 'https://www.visacashapprb.com',
    socialMedia: {
      twitter: '@visacashapprb',
      instagram: '@visacashapprb',
      facebook: 'RB Formula One Team'
    },
    headquarters: {
      address: 'Via Spallanzani 21, 48018 Faenza RA, Italy',
      coordinates: { lat: 44.2858, lng: 11.8761 }
    },
    keyPersonnel: {
      teamPrincipal: 'Laurent Mekies',
      technicalDirector: 'Jody Egginton',
      headOfAerodynamics: 'Jean-Claude Migeot',
      chiefEngineer: 'Jonathan Eddolls'
    },
    carSpecs: {
      engine: 'Honda RBPT RA624H 1.6L V6 Turbo Hybrid',
      transmission: 'RB 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'haas': {
    id: 'haas',
    name: 'MoneyGram Haas F1 Team',
    fullName: 'MoneyGram Haas F1 Team',
    shortName: 'Haas',
    founded: 2016,
    base: 'Kannapolis, USA',
    teamPrincipal: 'Ayao Komatsu',
    engine: 'Ferrari',
    chassis: 'VF-25',
    color: '#FFFFFF',
    secondaryColor: '#787878',
    drivers: ['Esteban Ocon', 'Oliver Bearman'],
    carImage: '/images/cars/haas-vf25.jpg',
    teamLogo: '/images/logos/haas-sidebar-logo.png',
    championships: { constructors: 0, drivers: 0 },
    currentSeason: {
      position: 7,
      points: 58,
      wins: 0,
      podiums: 0,
      poles: 0
    },
    history: 'The newest team on the grid, founded by American businessman Gene Haas. The first American-owned team since the 1980s.',
    achievements: [
      'Strong debut season (2016)',
      'First American team in decades',
      'Consistent midfield presence',
      'Partnership with Ferrari'
    ],
    website: 'https://www.haasf1team.com',
    socialMedia: {
      twitter: '@HaasF1Team',
      instagram: '@haasf1team',
      facebook: 'Haas F1 Team'
    },
    headquarters: {
      address: '4200 Haas Way, Kannapolis, NC 28081, USA',
      coordinates: { lat: 35.4676, lng: -80.6217 }
    },
    keyPersonnel: {
      teamPrincipal: 'Ayao Komatsu',
      technicalDirector: 'Simone Resta',
      headOfAerodynamics: 'Andrea Della Vecchia',
      chiefEngineer: 'Ayao Komatsu'
    },
    carSpecs: {
      engine: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
      transmission: 'Ferrari 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  },

  'kick-sauber': {
    id: 'kick-sauber',
    name: 'Stake F1 Team Kick Sauber',
    fullName: 'Stake F1 Team Kick Sauber',
    shortName: 'Kick Sauber',
    founded: 1993,
    base: 'Hinwil, Switzerland',
    teamPrincipal: 'Alessandro Alunni Bravi',
    engine: 'Ferrari',
    chassis: 'C45',
    color: '#52E252',
    secondaryColor: '#000000',
    drivers: ['Nico Hülkenberg', 'Gabriel Bortoleto'],
    carImage: '/images/cars/sauber-c45.jpg',
    teamLogo: '/images/logos/sauber-logo.png',
    championships: { constructors: 0, drivers: 0 },
    currentSeason: {
      position: 10,
      points: 0,
      wins: 0,
      podiums: 0,
      poles: 0
    },
    history: 'Swiss team with a long F1 history. Will become Audi\'s factory team from 2026, marking the German manufacturer\'s return to F1.',
    achievements: [
      'Longest-running independent team',
      'Future Audi factory team (2026)',
      'Swiss precision and engineering',
      'Consistent F1 presence since 1993'
    ],
    website: 'https://www.stakef1team.com',
    socialMedia: {
      twitter: '@stakef1team',
      instagram: '@stakef1team_ks',
      facebook: 'Stake F1 Team KICK Sauber'
    },
    headquarters: {
      address: 'Sauber Motorsport AG, Wildbachstrasse 9, 8340 Hinwil, Switzerland',
      coordinates: { lat: 47.2992, lng: 8.8484 }
    },
    keyPersonnel: {
      teamPrincipal: 'Alessandro Alunni Bravi',
      technicalDirector: 'James Key',
      headOfAerodynamics: 'Tiziano Battistini',
      chiefEngineer: 'Xevi Pujolar'
    },
    carSpecs: {
      engine: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
      transmission: 'Sauber 8-speed semi-automatic',
      wheels: '13" front, 13" rear',
      brakes: 'Brembo carbon fibre discs and pads'
    }
  }
};