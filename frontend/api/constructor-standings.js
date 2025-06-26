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

  // 2025 Constructor standings based on your statistics.ts
  const constructorStandings = [
    {
      position: 1,
      team: 'McLaren',
      points: 666,
      wins: 6,
      poles: 4,
      podiums: 20,
      drivers: ['Lando Norris', 'Oscar Piastri'],
      color: '#FF8700'
    },
    {
      position: 2,
      team: 'Ferrari',
      points: 652,
      wins: 5,
      poles: 12,
      podiums: 18,
      drivers: ['Charles Leclerc', 'Lewis Hamilton'],
      color: '#DC0000'
    },
    {
      position: 3,
      team: 'Red Bull Racing',
      points: 589,
      wins: 9,
      poles: 8,
      podiums: 15,
      drivers: ['Max Verstappen', 'Yuki Tsunoda'],
      color: '#0600EF'
    },
    {
      position: 4,
      team: 'Mercedes',
      points: 382,
      wins: 3,
      poles: 3,
      podiums: 8,
      drivers: ['George Russell', 'Kimi Antonelli'],
      color: '#00D2BE'
    },
    {
      position: 5,
      team: 'Aston Martin',
      points: 94,
      wins: 0,
      poles: 0,
      podiums: 1,
      drivers: ['Fernando Alonso', 'Lance Stroll'],
      color: '#006F62'
    },
    {
      position: 6,
      team: 'Alpine',
      points: 65,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Pierre Gasly', 'Franco Colapinto'],
      color: '#0090FF'
    },
    {
      position: 7,
      team: 'Haas',
      points: 58,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Esteban Ocon', 'Oliver Bearman'],
      color: '#FFFFFF'
    },
    {
      position: 8,
      team: 'RB',
      points: 46,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Liam Lawson', 'Isack Hadjar'],
      color: '#6692FF'
    },
    {
      position: 9,
      team: 'Williams',
      points: 17,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Alexander Albon', 'Carlos Sainz Jr.'],
      color: '#005AFF'
    },
    {
      position: 10,
      team: 'Kick Sauber',
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      drivers: ['Nico Hülkenberg', 'Gabriel Bortoleto'],
      color: '#52E252'
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