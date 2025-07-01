// api/constructor-standings.js - Constructor championship standings
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

  // 2025 Constructor standings after Austrian GP (Round 11 of 24)
  const constructorStandings = [
    {
      position: 1,
      team: 'McLaren',
      points: 417,
      wins: 7,
      poles: 5,
      podiums: 22,
      drivers: ['Lando Norris', 'Oscar Piastri'],
      color: '#FF8700'
    },
    {
      position: 2,
      team: 'Ferrari',
      points: 210,
      wins: 5,
      poles: 12,
      podiums: 19,
      drivers: ['Charles Leclerc', 'Lewis Hamilton'],
      color: '#DC0000'
    },
    {
      position: 3,
      team: 'Mercedes',
      points: 209,
      wins: 3,
      poles: 3,
      podiums: 8,
      drivers: ['George Russell', 'Kimi Antonelli'],
      color: '#00D2BE'
    },
    {
      position: 4,
      team: 'Red Bull Racing',
      points: 162,
      wins: 9,
      poles: 8,
      podiums: 15,
      drivers: ['Max Verstappen', 'Yuki Tsunoda'],
      color: '#0600EF'
    },
    {
      position: 5,
      team: 'Williams',
      points: 55,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Alexander Albon', 'Carlos Sainz Jr.'],
      color: '#005AFF'
    },
    {
      position: 6,
      team: 'RB',
      points: 36,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Liam Lawson', 'Isack Hadjar'],
      color: '#6692FF'
    },
    {
      position: 7,
      team: 'Haas',
      points: 29,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Esteban Ocon', 'Oliver Bearman'],
      color: '#FFFFFF'
    },
    {
      position: 8,
      team: 'Aston Martin',
      points: 28,
      wins: 0,
      poles: 0,
      podiums: 1,
      drivers: ['Fernando Alonso', 'Lance Stroll'],
      color: '#006F62'
    },
    {
      position: 9,
      team: 'Kick Sauber',
      points: 26,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Nico Hülkenberg', 'Gabriel Bortoleto'],
      color: '#52E252'
    },
    {
      position: 10,
      team: 'Alpine',
      points: 11,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Pierre Gasly', 'Franco Colapinto'],
      color: '#0090FF'
    }
  ];

  try {
    res.status(200).json(constructorStandings);
  } catch (error) {
    console.error('Error in constructor-standings API:', error);
    res.status(500).json({ 
      error: 'Failed to fetch constructor standings',
      message: error.message 
    });
  }
}