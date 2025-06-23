export interface StatRecord {
  driver: string;
  count: number;
  years: string;
  flag: string;
  team?: string;
  percentage?: number;
}

export interface ConstructorRecord {
  team: string;
  count: number;
  years: string;
  drivers?: string[];
}

export const f1Statistics = {
  // Most Race Wins (All Time)
  mostWins: [
    { driver: "Lewis Hamilton", count: 103, years: "2007-2021", flag: "🇬🇧" },
    { driver: "Michael Schumacher", count: 91, years: "1991-2006", flag: "🇩🇪" },
    { driver: "Max Verstappen", count: 61, years: "2016-2024", flag: "🇳🇱" },
    { driver: "Sebastian Vettel", count: 53, years: "2007-2022", flag: "🇩🇪" },
    { driver: "Alain Prost", count: 51, years: "1980-1993", flag: "🇫🇷" },
    { driver: "Ayrton Senna", count: 41, years: "1984-1994", flag: "🇧🇷" },
    { driver: "Fernando Alonso", count: 32, years: "2001-2024", flag: "🇪🇸" },
    { driver: "Nigel Mansell", count: 31, years: "1980-1995", flag: "🇬🇧" },
    { driver: "Jackie Stewart", count: 27, years: "1965-1973", flag: "🇬🇧" },
    { driver: "Jim Clark", count: 25, years: "1960-1968", flag: "🇬🇧" }
  ] as StatRecord[],

  // Most Podium Finishes
  mostPodiums: [
    { driver: "Lewis Hamilton", count: 201, years: "2007-2021", flag: "🇬🇧" },
    { driver: "Michael Schumacher", count: 155, years: "1991-2006", flag: "🇩🇪" },
    { driver: "Sebastian Vettel", count: 122, years: "2007-2022", flag: "🇩🇪" },
    { driver: "Max Verstappen", count: 104, years: "2016-2024", flag: "🇳🇱" },
    { driver: "Fernando Alonso", count: 98, years: "2001-2024", flag: "🇪🇸" },
    { driver: "Kimi Räikkönen", count: 103, years: "2001-2021", flag: "🇫🇮" },
    { driver: "Felipe Massa", count: 41, years: "2002-2017", flag: "🇧🇷" },
    { driver: "Alain Prost", count: 106, years: "1980-1993", flag: "🇫🇷" },
    { driver: "Ayrton Senna", count: 80, years: "1984-1994", flag: "🇧🇷" },
    { driver: "Jenson Button", count: 50, years: "2000-2016", flag: "🇬🇧" }
  ] as StatRecord[],

  // Most Pole Positions
  mostPoles: [
    { driver: "Lewis Hamilton", count: 104, years: "2007-2021", flag: "🇬🇧" },
    { driver: "Michael Schumacher", count: 68, years: "1991-2006", flag: "🇩🇪" },
    { driver: "Ayrton Senna", count: 65, years: "1984-1994", flag: "🇧🇷" },
    { driver: "Sebastian Vettel", count: 57, years: "2007-2022", flag: "🇩🇪" },
    { driver: "Max Verstappen", count: 40, years: "2016-2024", flag: "🇳🇱" },
    { driver: "Jim Clark", count: 33, years: "1960-1968", flag: "🇬🇧" },
    { driver: "Nigel Mansell", count: 32, years: "1980-1995", flag: "🇬🇧" },
    { driver: "Niki Lauda", count: 24, years: "1971-1985", flag: "🇦🇹" },
    { driver: "Juan Manuel Fangio", count: 29, years: "1950-1958", flag: "🇦🇷" },
    { driver: "Mika Häkkinen", count: 26, years: "1991-2001", flag: "🇫🇮" }
  ] as StatRecord[],

  // Most World Championships
  mostChampionships: [
    { driver: "Lewis Hamilton", count: 7, years: "2008, 2014-2015, 2017-2020", flag: "🇬🇧" },
    { driver: "Michael Schumacher", count: 7, years: "1994-1995, 2000-2004", flag: "🇩🇪" },
    { driver: "Juan Manuel Fangio", count: 5, years: "1951, 1954-1957", flag: "🇦🇷" },
    { driver: "Max Verstappen", count: 4, years: "2021-2024", flag: "🇳🇱" },
    { driver: "Alain Prost", count: 4, years: "1985-1986, 1989, 1993", flag: "🇫🇷" },
    { driver: "Sebastian Vettel", count: 4, years: "2010-2013", flag: "🇩🇪" },
    { driver: "Ayrton Senna", count: 3, years: "1988, 1990-1991", flag: "🇧🇷" },
    { driver: "Jackie Stewart", count: 3, years: "1969, 1971, 1973", flag: "🇬🇧" },
    { driver: "Niki Lauda", count: 3, years: "1975, 1977, 1984", flag: "🇦🇹" },
    { driver: "Nelson Piquet", count: 3, years: "1981, 1983, 1987", flag: "🇧🇷" }
  ] as StatRecord[],

  // Most Fastest Laps
  mostFastestLaps: [
    { driver: "Lewis Hamilton", count: 67, years: "2007-2021", flag: "🇬🇧" },
    { driver: "Michael Schumacher", count: 77, years: "1991-2006", flag: "🇩🇪" },
    { driver: "Kimi Räikkönen", count: 46, years: "2001-2021", flag: "🇫🇮" },
    { driver: "Alain Prost", count: 41, years: "1980-1993", flag: "🇫🇷" },
    { driver: "Sebastian Vettel", count: 38, years: "2007-2022", flag: "🇩🇪" },
    { driver: "Max Verstappen", count: 33, years: "2016-2024", flag: "🇳🇱" },
    { driver: "Nigel Mansell", count: 30, years: "1980-1995", flag: "🇬🇧" },
    { driver: "Jim Clark", count: 28, years: "1960-1968", flag: "🇬🇧" },
    { driver: "Mika Häkkinen", count: 25, years: "1991-2001", flag: "🇫🇮" },
    { driver: "Niki Lauda", count: 24, years: "1971-1985", flag: "🇦🇹" }
  ] as StatRecord[]
};

export const constructorStatistics = {
  // Most Constructor Championships
  mostConstructorTitles: [
    { team: "Ferrari", count: 16, years: "1961, 1964, 1975-1977, 1979, 1982-1983, 1999-2004, 2007-2008" },
    { team: "Williams", count: 9, years: "1980-1981, 1986-1987, 1992-1994, 1996-1997" },
    { team: "McLaren", count: 8, years: "1974, 1984-1985, 1988, 1989, 1990-1991, 1998" },
    { team: "Mercedes", count: 8, years: "2014-2021" },
    { team: "Red Bull Racing", count: 6, years: "2010-2013, 2022-2024" },
    { team: "Lotus", count: 7, years: "1963, 1965, 1968, 1970, 1972-1973, 1978" },
    { team: "Cooper", count: 2, years: "1959-1960" },
    { team: "Brabham", count: 2, years: "1966-1967" },
    { team: "Tyrrell", count: 1, years: "1971" },
    { team: "Matra", count: 1, years: "1969" }
  ] as ConstructorRecord[],

  // Most Race Wins (Constructors)
  mostConstructorWins: [
    { team: "Ferrari", count: 245, years: "1951-2024" },
    { team: "McLaren", count: 183, years: "1968-2021" },
    { team: "Williams", count: 114, years: "1977-2012" },
    { team: "Mercedes", count: 125, years: "2010-2024" },
    { team: "Red Bull Racing", count: 118, years: "2009-2024" },
    { team: "Lotus", count: 79, years: "1960-1987" },
    { team: "Brabham", count: 35, years: "1964-1985" },
    { team: "Tyrrell", count: 23, years: "1970-1983" },
    { team: "BRM", count: 17, years: "1959-1972" },
    { team: "Cooper", count: 16, years: "1958-1967" }
  ] as ConstructorRecord[]
};

// Current Season Statistics (2024 Final)
export const currentSeasonStats = {
  driverStandings: [
    { driver: "Max Verstappen", team: "Red Bull Racing", points: 437, wins: 9, podiums: 11, poles: 8 },
    { driver: "Lando Norris", team: "McLaren", points: 374, wins: 3, podiums: 8, poles: 4 },
    { driver: "Charles Leclerc", team: "Ferrari", points: 356, wins: 2, podiums: 7, poles: 8 },
    { driver: "Oscar Piastri", team: "McLaren", points: 292, wins: 2, podiums: 5, poles: 0 },
    { driver: "Carlos Sainz", team: "Ferrari", points: 290, wins: 1, podiums: 4, poles: 3 },
    { driver: "George Russell", team: "Mercedes", points: 245, wins: 1, podiums: 3, poles: 2 },
    { driver: "Lewis Hamilton", team: "Mercedes", points: 190, wins: 2, podiums: 3, poles: 1 },
    { driver: "Sergio Pérez", team: "Red Bull Racing", points: 152, wins: 0, podiums: 2, poles: 0 },
    { driver: "Fernando Alonso", team: "Aston Martin", points: 62, wins: 0, podiums: 0, poles: 0 },
    { driver: "Nico Hülkenberg", team: "Haas", points: 31, wins: 0, podiums: 0, poles: 0 }
  ],
  
  constructorStandings: [
    { team: "McLaren", points: 666, wins: 6, poles: 4 },
    { team: "Ferrari", points: 652, wins: 5, poles: 12 },
    { team: "Red Bull Racing", points: 589, wins: 9, poles: 8 },
    { team: "Mercedes", points: 382, wins: 3, poles: 3 },
    { team: "Aston Martin", points: 94, wins: 0, poles: 0 },
    { team: "Alpine", points: 65, wins: 0, poles: 0 },
    { team: "Haas", points: 58, wins: 0, poles: 0 },
    { team: "RB", points: 46, wins: 0, poles: 0 },
    { team: "Williams", points: 17, wins: 0, poles: 0 },
    { team: "Kick Sauber", points: 0, wins: 0, poles: 0 }
  ]
};

// Records and Achievements
export const f1Records = {
  youngest: {
    winner: { driver: "Max Verstappen", age: "18 years, 228 days", race: "Spain 2016" },
    champion: { driver: "Sebastian Vettel", age: "23 years, 134 days", year: "2010" },
    podiumFinisher: { driver: "Max Verstappen", age: "18 years, 228 days", race: "Spain 2016" },
    polePosition: { driver: "Sebastian Vettel", age: "21 years, 73 days", race: "Italy 2008" },
    pointsScorer: { driver: "Max Verstappen", age: "17 years, 166 days", race: "Malaysia 2015" }
  },
  oldest: {
    winner: { driver: "Luigi Fagioli", age: "53 years, 22 days", race: "France 1951" },
    champion: { driver: "Juan Manuel Fangio", age: "46 years, 41 days", year: "1957" },
    podiumFinisher: { driver: "Louis Chiron", age: "55 years, 292 days", race: "Monaco 1955" },
    pointsScorer: { driver: "Philippe Étancelin", age: "56 years, 227 days", race: "Germany 1950" }
  },
  streaks: {
    consecutiveWins: { driver: "Sebastian Vettel", count: 9, period: "2013" },
    consecutivePodiums: { driver: "Lewis Hamilton", count: 33, period: "2014-2016" },
    consecutivePoles: { driver: "Ayrton Senna", count: 8, period: "1988-1989" },
    consecutivePoints: { driver: "Kimi Räikkönen", count: 27, period: "2012-2013" }
  },
  single_season: {
    mostWins: { driver: "Max Verstappen", count: 19, year: "2023" },
    mostPoles: { driver: "Sebastian Vettel", count: 15, year: "2011" },
    mostPodiums: { driver: "Michael Schumacher", count: 17, year: "2002" },
    mostPoints: { driver: "Max Verstappen", count: 575, year: "2023" },
    mostFastestLaps: { driver: "Michael Schumacher", count: 10, year: "2004" }
  }
};

// Team Records
export const teamRecords = {
  mostSuccessfulEra: {
    ferrari_schumacher: {
      period: "1999-2004",
      championships: 5,
      wins: 53,
      description: "Ferrari's dominant era with Michael Schumacher"
    },
    mclaren_senna_prost: {
      period: "1988-1991", 
      championships: 4,
      wins: 44,
      description: "McLaren's golden age with Senna and Prost"
    },
    mercedes_hamilton: {
      period: "2014-2020",
      championships: 7,
      wins: 102,
      description: "Mercedes' hybrid era dominance"
    },
    red_bull_vettel: {
      period: "2010-2013",
      championships: 4,
      wins: 39,
      description: "Red Bull's four consecutive titles"
    }
  }
};