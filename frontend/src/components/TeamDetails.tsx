import React from 'react';
import { MapPin, User, Wrench, Calendar, Trophy, Target, TrendingUp } from 'lucide-react';
import DriverCard from './DriverCard';

interface TeamDetailsProps {
  selectedTeam: string;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ selectedTeam }) => {
  const getTeamLogo = (teamId: string) => {
    const logoMap: Record<string, string> = {
      'red-bull': '/images/logos/red-bull-logo.png',
      'ferrari': '/images/logos/ferrari-logo.png',
      'mercedes': '/images/logos/mercedes-logo.png',
      'mclaren': '/images/logos/mclaren-logo.png',
      'aston-martin': '/images/logos/aston-martin-logo.png',
      'alpine': '/images/logos/alpine-logo.png',
      'williams': '/images/logos/williams-logo.png',
      'rb': '/images/logos/rb-logo.png',
      'haas': '/images/logos/haas-logo.png',
      'kick-sauber': '/images/logos/sauber-logo.png'
    };
    return logoMap[teamId] || '/images/logos/f1-logo.png';
  };

  const teamData = {
    'red-bull': {
      name: 'Oracle Red Bull Racing',
      fullName: 'Oracle Red Bull Racing',
      founded: 2005,
      base: 'Milton Keynes, United Kingdom',
      teamPrincipal: 'Christian Horner',
      engine: 'Honda RBPT',
      chassis: 'RB21',
      color: '#0600EF',
      secondaryColor: '#DC143C',
      carImage: '/images/cars/red-bull-rb21.jpg',
      teamLogo: '/images/logos/red-bull-logo.png',
      drivers: [
        {
          name: 'Max Verstappen',
          number: 1,
          country: '🇳🇱',
          age: 27,
          image: '/images/drivers/max-verstappen.png',
          championships: 4,
          wins: 65,
          podiums: 117,
          debut: 2015
        },
        {
          name: 'Yuki Tsunoda',
          number: 22,
          country: '🇯🇵',
          age: 24,
          image: '/images/drivers/yuki-tsunoda.jpg',
          championships: 0,
          wins: 0,
          podiums: 0,
          debut: 2021
        }
      ],
      championships: { constructors: 6, drivers: 8 },
      currentSeason: {
        position: 4,
        points: 382,
        wins: 3,
        podiums: 8,
        poles: 3
      },
      history: 'Originally founded as Stewart Grand Prix in 1997, the team was purchased by Red Bull in 2005. Under their ownership, Red Bull Racing has become one of the most successful teams in F1 history, winning multiple championships and establishing themselves as a dominant force in the sport.',
      achievements: [
        'Youngest driver to win a championship (Max Verstappen, 2021)',
        'Most wins in a single season (19 wins, 2023)',
        'First team to score over 860 points in a season',
        'Consecutive championship wins (2022-2024)'
      ]
    },
    'ferrari': {
      name: 'Scuderia Ferrari',
      fullName: 'Scuderia Ferrari',
      founded: 1929,
      base: 'Maranello, Italy',
      teamPrincipal: 'Frédéric Vasseur',
      engine: 'Ferrari',
      chassis: 'SF-25',
      color: '#DC0000',
      secondaryColor: '#FFF200',
      carImage: '/images/cars/ferrari-sf25.jpg',
      teamLogo: '/images/logos/ferrari-logo.png',
      drivers: [
        {
          name: 'Charles Leclerc',
          number: 16,
          country: '🇲🇨',
          age: 27,
          image: '/images/drivers/charles-leclerc.jpg',
          championships: 0,
          wins: 8,
          podiums: 47,
          debut: 2018
        },
        {
          name: 'Lewis Hamilton',
          number: 44,
          country: '🇬🇧',
          age: 40,
          image: '/images/drivers/lewis-hamilton.jpg',
          championships: 7,
          wins: 105,
          podiums: 203,
          debut: 2007
        }
      ],
      championships: { constructors: 16, drivers: 15 },
      currentSeason: {
        position: 2,
        points: 470,
        wins: 4,
        podiums: 14,
        poles: 6
      },
      history: 'The oldest and most successful team in Formula 1 history. Founded by Enzo Ferrari, the Scuderia has been competing since the first F1 season in 1950. Known for their passionate fans, iconic red cars, and legendary drivers.',
      achievements: [
        'Most constructor championships (16)',
        'Most race wins in F1 history',
        'Only team to compete in every F1 season since 1950',
        'Home to legendary drivers like Schumacher, Lauda, and Alonso'
      ]
    },
    'mercedes': {
      name: 'Mercedes-AMG Petronas F1 Team',
      fullName: 'Mercedes-AMG Petronas Formula One Team',
      founded: 1954,
      base: 'Brackley, United Kingdom',
      teamPrincipal: 'Toto Wolff',
      engine: 'Mercedes',
      chassis: 'W16',
      color: '#00D2BE',
      secondaryColor: '#000000',
      carImage: '/images/cars/mercedes-w16.jpg',
      teamLogo: '/images/logos/mercedes-logo.png',
      drivers: [
        {
          name: 'George Russell',
          number: 63,
          country: '🇬🇧',
          age: 26,
          image: '/images/drivers/george-russell.jpg',
          championships: 0,
          wins: 4,
          podiums: 20,
          debut: 2019
        },
        {
          name: 'Kimi Antonelli',
          number: 12,
          country: '🇮🇹',
          age: 18,
          image: '/images/drivers/kimi-antonelli.jpg',
          championships: 0,
          wins: 0,
          podiums: 1,
          debut: 2025
        }
      ],
      championships: { constructors: 8, drivers: 9 },
      currentSeason: {
        position: 3,
        points: 469,
        wins: 4,
        podiums: 15,
        poles: 5
      },
      history: 'Mercedes returned to F1 as a constructor in 2010 and dominated the hybrid era from 2014-2021. Known for technical excellence and strategic mastery under Toto Wolff\'s leadership.',
      achievements: [
        'Eight consecutive constructor championships (2014-2021)',
        'Lewis Hamilton\'s seven championships with the team',
        'Most dominant hybrid era performance',
        'Technical innovation leaders'
      ]
    },
    'mclaren': {
      name: 'McLaren Formula 1 Team',
      fullName: 'McLaren Formula 1 Team',
      founded: 1963,
      base: 'Woking, United Kingdom',
      teamPrincipal: 'Andrea Stella',
      engine: 'Mercedes',
      chassis: 'MCL39',
      color: '#FF8700',
      secondaryColor: '#000000',
      carImage: '/images/cars/mclaren-mcl39.jpg',
      teamLogo: '/images/logos/mclaren-logo.png',
      drivers: [
        {
          name: 'Lando Norris',
          number: 4,
          country: '🇬🇧',
          age: 25,
          image: '/images/drivers/lando-norris.jpg',
          championships: 0,
          wins: 8,
          podiums: 36,
          debut: 2019
        },
        {
          name: 'Oscar Piastri',
          number: 81,
          country: '🇦🇺',
          age: 23,
          image: '/images/drivers/oscar-piastri.jpg',
          championships: 0,
          wins: 7,
          podiums: 20,
          debut: 2023
        }
      ],
      championships: { constructors: 8, drivers: 12 },
      currentSeason: {
        position: 1,
        points: 625,
        wins: 10,
        podiums: 20,
        poles: 8
      },
      history: 'Founded by Bruce McLaren, the team has been a mainstay of F1 success. Famous for the McLaren-Honda partnership of the late 1980s and early 1990s with Ayrton Senna and Alain Prost.',
      achievements: [
        'Second most successful constructor in F1',
        'Ayrton Senna\'s legendary drives',
        '1988 season - 15 wins out of 16 races',
        'Current championship leaders (2025)'
      ]
    },
    'aston-martin': {
      name: 'Aston Martin Aramco Formula One Team',
      fullName: 'Aston Martin Aramco Cognizant Formula One Team',
      founded: 2021,
      base: 'Silverstone, United Kingdom',
      teamPrincipal: 'Mike Krack',
      engine: 'Mercedes',
      chassis: 'AMR25',
      color: '#006F62',
      secondaryColor: '#CEDC00',
      carImage: '/images/cars/aston-martin-amr25.jpg',
      teamLogo: '/images/logos/aston-martin-logo.png',
      drivers: [
        {
          name: 'Fernando Alonso',
          number: 14,
          country: '🇪🇸',
          age: 43,
          image: '/images/drivers/fernando-alonso.jpg',
          championships: 2,
          wins: 32,
          podiums: 106,
          debut: 2001
        },
        {
          name: 'Lance Stroll',
          number: 18,
          country: '🇨🇦',
          age: 26,
          image: '/images/drivers/lance-stroll.jpg',
          championships: 0,
          wins: 0,
          podiums: 3,
          debut: 2017
        }
      ],
      championships: { constructors: 0, drivers: 0 },
      currentSeason: {
        position: 5,
        points: 100,
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
      ]
    },
    'alpine': {
      name: 'BWT Alpine F1 Team',
      fullName: 'BWT Alpine F1 Team',
      founded: 2021,
      base: 'Enstone, United Kingdom',
      teamPrincipal: 'Oliver Oakes',
      engine: 'Renault',
      chassis: 'A525',
      color: '#0090FF',
      secondaryColor: '#FF87BC',
      carImage: '/images/cars/alpine-a525.jpg',
      teamLogo: '/images/logos/alpine-logo.png',
      drivers: [
        {
          name: 'Pierre Gasly',
          number: 10,
          country: '🇫🇷',
          age: 28,
          image: '/images/drivers/pierre-gasly.jpg',
          championships: 0,
          wins: 1,
          podiums: 5,
          debut: 2017
        },
        {
          name: 'Franco Colapinto',
          number: 7,
          country: '🇦🇷',
          age: 21,
          image: '/images/drivers/franco-colapinto.jpg',
          championships: 0,
          wins: 0,
          podiums: 0,
          debut: 2024
        }
      ],
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
      ]
    },
    'williams': {
      name: 'Williams Racing',
      fullName: 'Williams Racing',
      founded: 1977,
      base: 'Grove, United Kingdom',
      teamPrincipal: 'James Vowles',
      engine: 'Mercedes',
      chassis: 'FW47',
      color: '#005AFF',
      secondaryColor: '#FFFFFF',
      carImage: '/images/cars/williams-fw47.jpg',
      teamLogo: '/images/logos/williams-logo.png',
      drivers: [
        {
          name: 'Alexander Albon',
          number: 23,
          country: '🇹🇭',
          age: 28,
          image: '/images/drivers/alex-albon.jpg',
          championships: 0,
          wins: 0,
          podiums: 2,
          debut: 2019
        },
        {
          name: 'Carlos Sainz Jr.',
          number: 55,
          country: '🇪🇸',
          age: 30,
          image: '/images/drivers/carlos-sainz.jpg',
          championships: 0,
          wins: 5,
          podiums: 27,
          debut: 2015
        }
      ],
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
      ]
    },
    'rb': {
      name: 'Visa Cash App RB Formula One Team',
      fullName: 'Visa Cash App RB Formula One Team',
      founded: 2020,
      base: 'Faenza, Italy',
      teamPrincipal: 'Laurent Mekies',
      engine: 'Honda RBPT',
      chassis: 'VCARB 01',
      color: '#6692FF',
      secondaryColor: '#C8102E',
      carImage: '/images/cars/rb-vcarb01.jpg',
      teamLogo: '/images/logos/rb-logo.png',
      drivers: [
        {
          name: 'Liam Lawson',
          number: 30,
          country: '🇳🇿',
          age: 22,
          image: '/images/drivers/liam-lawson.jpg',
          championships: 0,
          wins: 0,
          podiums: 0,
          debut: 2023
        },
        {
          name: 'Isack Hadjar',
          number: 6,
          country: '🇫🇷',
          age: 20,
          image: '/images/drivers/isack-hadjar.jpg',
          championships: 0,
          wins: 0,
          podiums: 0,
          debut: 2025
        }
      ],
      championships: { constructors: 1, drivers: 0 },
      currentSeason: {
        position: 8,
        points: 50,
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
      ]
    },
    'haas': {
      name: 'MoneyGram Haas F1 Team',
      fullName: 'MoneyGram Haas F1 Team',
      founded: 2016,
      base: 'Kannapolis, USA',
      teamPrincipal: 'Ayao Komatsu',
      engine: 'Ferrari',
      chassis: 'VF-25',
      color: '#FFFFFF',
      secondaryColor: '#787878',
      carImage: '/images/cars/haas-vf25.jpg',
      teamLogo: '/images/logos/haas-logo.png',
      drivers: [
        {
          name: 'Esteban Ocon',
          number: 31,
          country: '🇫🇷',
          age: 28,
          image: '/images/drivers/esteban-ocon.jpg',
          championships: 0,
          wins: 1,
          podiums: 3,
          debut: 2016
        },
        {
          name: 'Oliver Bearman',
          number: 87,
          country: '🇬🇧',
          age: 19,
          image: '/images/drivers/oliver-bearman.jpg',
          championships: 0,
          wins: 0,
          podiums: 0,
          debut: 2024
        }
      ],
      championships: { constructors: 0, drivers: 0 },
      currentSeason: {
        position: 7,
        points: 59,
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
      ]
    },
    'kick-sauber': {
      name: 'Stake F1 Team Kick Sauber',
      fullName: 'Stake F1 Team Kick Sauber',
      founded: 1993,
      base: 'Hinwil, Switzerland',
      teamPrincipal: 'Alessandro Alunni Bravi',
      engine: 'Ferrari',
      chassis: 'C45',
      color: '#52E252',
      secondaryColor: '#000000',
      carImage: '/images/cars/sauber-c45.jpg',
      teamLogo: '/images/logos/sauber-logo.png',
      drivers: [
        {
          name: 'Nico Hülkenberg',
          number: 27,
          country: '🇩🇪',
          age: 37,
          image: '/images/drivers/nico-hulkenberg.jpg',
          championships: 0,
          wins: 0,
          podiums: 0,
          debut: 2010
        },
        {
          name: 'Gabriel Bortoleto',
          number: 5,
          country: '🇧🇷',
          age: 20,
          image: '/images/drivers/gabriel-bortoleto.jpg',
          championships: 0,
          wins: 0,
          podiums: 0,
          debut: 2025
        }
      ],
      championships: { constructors: 0, drivers: 0 },
      currentSeason: {
        position: 10,
        points: 19,
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
      ]
    }
  };

  const team = teamData[selectedTeam as keyof typeof teamData];

  if (!team) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Team not found</h2>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative" 
      style={{ 
        background: `linear-gradient(135deg, ${team.color}30, ${team.secondaryColor}20, ${team.color}15), linear-gradient(to bottom, ${team.color}08, #000000)` 
      }}
    >
      {/* Fixed Background Logo */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${getTeamLogo(selectedTeam)})`,
          backgroundSize: '70vh',
          backgroundPosition: 'center center',
          opacity: 0.15
        }}
      >
        {/* Color fade overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${team.color}10 0%, transparent 70%), linear-gradient(135deg, ${team.color}05, ${team.secondaryColor}05)`
          }}
        ></div>
      </div>

      {/* Team Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        
        <div className="relative z-10 px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{team.name}</h1>
            <p className="text-xl text-gray-300">{team.fullName}</p>
            
            {/* Team Colors Bar */}
            <div className="flex justify-center mt-6">
              <div className="flex rounded-lg overflow-hidden">
                <div className="w-16 h-8" style={{ backgroundColor: team.color }}></div>
                <div className="w-16 h-8" style={{ backgroundColor: team.secondaryColor }}></div>
              </div>
            </div>
          </div>

          {/* Car Showcase */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <img
                src={team.carImage}
                alt={`${team.name} ${team.chassis}`}
                className="w-full max-w-2xl h-64 object-contain"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect width="400" height="200" fill="${encodeURIComponent(team.color)}20"/><text x="200" y="100" text-anchor="middle" fill="white" font-size="24" font-family="Arial">${team.chassis}</text></svg>`;
                }}
              />
              <h3 className="text-2xl font-bold text-white mt-4">{team.chassis}</h3>
              <p className="text-gray-300">2025 Championship Contender</p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Cards */}
      <div className="relative z-10 px-8 py-12">
        <h2 className="text-4xl font-bold text-white text-center mb-8">2025 Drivers</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.drivers.map((driver, index) => (
            <DriverCard key={index} driver={driver} teamColor={team.color} />
          ))}
        </div>
      </div>
      
      {/* Team Information */}
      <div className="relative z-10 px-8 py-12 bg-black/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Details */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <User className="w-6 h-6 mr-3" style={{ color: team.color }} />
              Team Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Founded: {team.founded}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{team.base}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">TP: {team.teamPrincipal}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Wrench className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">Engine: {team.engine}</span>
              </div>
            </div>
          </div>

          {/* Current Season */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3" style={{ color: team.color }} />
              2025 Season
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Championship Position:</span>
                <span className="text-white font-bold">P{team.currentSeason.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Points:</span>
                <span className="text-white font-bold">{team.currentSeason.points}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Wins:</span>
                <span className="text-yellow-400 font-bold">{team.currentSeason.wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Podiums:</span>
                <span className="text-orange-400 font-bold">{team.currentSeason.podiums}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Pole Positions:</span>
                <span className="text-purple-400 font-bold">{team.currentSeason.poles}</span>
              </div>
            </div>
          </div>

          {/* Championships */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-3" style={{ color: team.color }} />
              Championships
            </h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-yellow-600/20 rounded-lg">
                <div className="text-3xl font-bold text-yellow-400">{team.championships.constructors}</div>
                <div className="text-gray-300 text-sm">Constructor Titles</div>
              </div>
              <div className="text-center p-4 bg-green-600/20 rounded-lg">
                <div className="text-3xl font-bold text-green-400">{team.championships.drivers}</div>
                <div className="text-gray-300 text-sm">Driver Titles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team History */}
      <div className="relative z-10 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Team History</h2>
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{team.history}</p>
            
            <h3 className="text-2xl font-bold text-white mb-4">Key Achievements</h3>
            <ul className="space-y-2">
              {team.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Target className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: team.color }} />
                  <span className="text-gray-300">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TeamDetails;