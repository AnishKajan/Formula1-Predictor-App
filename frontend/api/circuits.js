// api/circuits.js - Vercel Serverless Function
export default function handler(req, res) {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // 2025 F1 Calendar Circuits
  const circuits = [
    {
      name: "Albert Park Grand Prix Circuit",
      country: "Australia",
      city: "Melbourne",
      length: 5.278,
      turns: 14,
      drs_zones: 3,
      lap_record: "1:20.235",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Suzuka International Racing Course",
      country: "Japan",
      city: "Suzuka",
      length: 5.807,
      turns: 18,
      drs_zones: 2,
      lap_record: "1:30.983",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Shanghai International Circuit",
      country: "China",
      city: "Shanghai",
      length: 5.451,
      turns: 16,
      drs_zones: 2,
      lap_record: "1:32.238",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Bahrain International Circuit",
      country: "Bahrain",
      city: "Sakhir",
      length: 5.412,
      turns: 15,
      drs_zones: 3,
      lap_record: "1:31.447",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Jeddah Corniche Circuit",
      country: "Saudi Arabia",
      city: "Jeddah",
      length: 6.174,
      turns: 27,
      drs_zones: 3,
      lap_record: "1:30.734",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Miami International Autodrome",
      country: "United States",
      city: "Miami",
      length: 5.41,
      turns: 19,
      drs_zones: 3,
      lap_record: "1:31.361",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Autodromo Enzo e Dino Ferrari",
      country: "Italy",
      city: "Imola",
      length: 4.909,
      turns: 19,
      drs_zones: 2,
      lap_record: "1:15.484",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Circuit de Monaco",
      country: "Monaco",
      city: "Monte Carlo",
      length: 3.337,
      turns: 19,
      drs_zones: 1,
      lap_record: "1:12.909",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Circuit Gilles Villeneuve",
      country: "Canada",
      city: "Montreal",
      length: 4.361,
      turns: 14,
      drs_zones: 3,
      lap_record: "1:13.078",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Circuit de Barcelona-Catalunya",
      country: "Spain",
      city: "Barcelona",
      length: 4.675,
      turns: 16,
      drs_zones: 2,
      lap_record: "1:16.330",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Red Bull Ring",
      country: "Austria",
      city: "Spielberg",
      length: 4.318,
      turns: 10,
      drs_zones: 3,
      lap_record: "1:05.619",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Silverstone Circuit",
      country: "United Kingdom",
      city: "Silverstone",
      length: 5.891,
      turns: 18,
      drs_zones: 2,
      lap_record: "1:27.097",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Hungaroring",
      country: "Hungary",
      city: "Budapest",
      length: 4.381,
      turns: 14,
      drs_zones: 2,
      lap_record: "1:16.627",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Circuit de Spa-Francorchamps",
      country: "Belgium",
      city: "Spa",
      length: 7.004,
      turns: 19,
      drs_zones: 2,
      lap_record: "1:46.286",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Circuit Park Zandvoort",
      country: "Netherlands",
      city: "Zandvoort",
      length: 4.259,
      turns: 14,
      drs_zones: 2,
      lap_record: "1:11.097",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Autodromo Nazionale di Monza",
      country: "Italy",
      city: "Monza",
      length: 5.793,
      turns: 11,
      drs_zones: 3,
      lap_record: "1:21.046",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Baku City Circuit",
      country: "Azerbaijan",
      city: "Baku",
      length: 6.003,
      turns: 20,
      drs_zones: 2,
      lap_record: "1:43.009",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Marina Bay Street Circuit",
      country: "Singapore",
      city: "Singapore",
      length: 5.063,
      turns: 23,
      drs_zones: 2,
      lap_record: "1:35.867",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Circuit of the Americas",
      country: "United States",
      city: "Austin",
      length: 5.513,
      turns: 20,
      drs_zones: 2,
      lap_record: "1:36.169",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Autodromo Hermanos Rodriguez",
      country: "Mexico",
      city: "Mexico City",
      length: 4.304,
      turns: 17,
      drs_zones: 3,
      lap_record: "1:17.774",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Autodromo Jose Carlos Pace",
      country: "Brazil",
      city: "São Paulo",
      length: 4.309,
      turns: 15,
      drs_zones: 2,
      lap_record: "1:10.540",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Las Vegas Strip Circuit",
      country: "United States",
      city: "Las Vegas",
      length: 6.201,
      turns: 17,
      drs_zones: 2,
      lap_record: "1:35.490",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    },
    {
      name: "Losail International Circuit",
      country: "Qatar",
      city: "Lusail",
      length: 5.419,
      turns: 16,
      drs_zones: 2,
      lap_record: "1:24.319",
      surface: "Asphalt",
      direction: "Clockwise"
    },
    {
      name: "Yas Marina Circuit",
      country: "United Arab Emirates",
      city: "Abu Dhabi",
      length: 5.281,
      turns: 16,
      drs_zones: 2,
      lap_record: "1:26.103",
      surface: "Asphalt",
      direction: "Anti-clockwise"
    }
  ];

  try {
    // Return the circuits data
    res.status(200).json(circuits);
  } catch (error) {
    console.error('Error fetching circuits:', error);
    res.status(500).json({ 
      error: 'Failed to fetch circuits',
      message: error.message 
    });
  }
}
