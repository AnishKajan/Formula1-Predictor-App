// api/teams.js - Teams API endpoint for Vercel
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // 2025 F1 Teams Data (based on your teams.ts)
  const teams = {
    'Red Bull Racing': {
      drivers: ['Max Verstappen', 'Yuki Tsunoda'],
      car: 'RB21',
      principal: 'Christian Horner',
      engine: 'Honda RBPT',
      founded: 2005,
      championships: 6,
      base: 'Milton Keynes, UK',
      color: '#0600EF',
      secondaryColor: '#DC143C',
      fullName: 'Oracle Red Bull Racing',
      shortName: 'Red Bull'
    },
    'Ferrari': {
      drivers: ['Charles Leclerc', 'Lewis Hamilton'],
      car: 'SF-25',
      principal: 'Frédéric Vasseur',
      engine: 'Ferrari',
      founded: 1929,
      championships: 16,
      base: 'Maranello, Italy',
      color: '#DC0000',
      secondaryColor: '#FFF200',
      fullName: 'Scuderia Ferrari',
      shortName: 'Ferrari'
    },
    'Mercedes': {
      drivers: ['George Russell', 'Kimi Antonelli'],
      car: 'W16',
      principal: 'Toto Wolff',
      engine: 'Mercedes',
      founded: 1954,
      championships: 8,
      base: 'Brackley, UK',
      color: '#00D2BE',
      secondaryColor: '#000000',
      fullName: 'Mercedes-AMG Petronas F1 Team',
      shortName: 'Mercedes'
    },
    'McLaren': {
      drivers: ['Lando Norris', 'Oscar Piastri'],
      car: 'MCL39',
      principal: 'Andrea Stella',
      engine: 'Mercedes',
      founded: 1963,
      championships: 8,
      base: 'Woking, UK',
      color: '#FF8700',
      secondaryColor: '#000000',
      fullName: 'McLaren Formula 1 Team',
      shortName: 'McLaren'
    },
    'Aston Martin': {
      drivers: ['Fernando Alonso', 'Lance Stroll'],
      car: 'AMR25',
      principal: 'Mike Krack',
      engine: 'Mercedes',
      founded: 2021,
      championships: 0,
      base: 'Silverstone, UK',
      color: '#006F62',
      secondaryColor: '#CEDC00',
      fullName: 'Aston Martin Aramco Formula One Team',
      shortName: 'Aston Martin'
    },
    'Alpine': {
      drivers: ['Pierre Gasly', 'Jack Doohan'],
      car: 'A525',
      principal: 'Oliver Oakes',
      engine: 'Renault',
      founded: 2021,
      championships: 0,
      base: 'Enstone, UK',
      color: '#0090FF',
      secondaryColor: '#FF87BC',
      fullName: 'BWT Alpine F1 Team',
      shortName: 'Alpine'
    },
    'Williams': {
      drivers: ['Alexander Albon', 'Carlos Sainz Jr.'],
      car: 'FW47',
      principal: 'James Vowles',
      engine: 'Mercedes',
      founded: 1977,
      championships: 9,
      base: 'Grove, UK',
      color: '#005AFF',
      secondaryColor: '#FFFFFF',
      fullName: 'Atlassian Williams Racing',
      shortName: 'Williams'
    },
    'RB': {
      drivers: ['Liam Lawson', 'Isack Hadjar'],
      car: 'VCARB 01',
      principal: 'Laurent Mekies',
      engine: 'Honda RBPT',
      founded: 2020,
      championships: 0,
      base: 'Faenza, Italy',
      color: '#6692FF',
      secondaryColor: '#C8102E',
      fullName: 'Visa Cash App RB Formula One Team',
      shortName: 'RB'
    },
    'Haas': {
      drivers: ['Esteban Ocon', 'Oliver Bearman'],
      car: 'VF-25',
      principal: 'Ayao Komatsu',
      engine: 'Ferrari',
      founded: 2016,
      championships: 0,
      base: 'Kannapolis, USA',
      color: '#FFFFFF',
      secondaryColor: '#787878',
      fullName: 'MoneyGram Haas F1 Team',
      shortName: 'Haas'
    },
    'Kick Sauber': {
      drivers: ['Nico Hülkenberg', 'Gabriel Bortoleto'],
      car: 'C45',
      principal: 'Alessandro Alunni Bravi',
      engine: 'Ferrari',
      founded: 1993,
      championships: 0,
      base: 'Hinwil, Switzerland',
      color: '#52E252',
      secondaryColor: '#000000',
      fullName: 'Stake F1 Team Kick Sauber',
      shortName: 'Kick Sauber'
    }
  };

  try {
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error in teams API:', error);
    res.status(500).json({ 
      error: 'Failed to fetch teams',
      message: error.message 
    });
  }
}