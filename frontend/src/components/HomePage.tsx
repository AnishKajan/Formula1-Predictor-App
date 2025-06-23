import React from 'react';
import { ExternalLink, Trophy, Clock, Flag, Target, BarChart3 } from 'lucide-react';
import StatisticsTable from './StatisticsTable';
import CheckeredBackground from './CheckeredBackground';

const HomePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [activeWeekendTab, setActiveWeekendTab] = React.useState<'regular' | 'sprint'>('regular');

  const heroImages = [
    {
      src: "/images/tracks/imola-circuit.jpg",
      credit: "Autodromo Enzo e Dino Ferrari, Imola - Official F1"
    },
    {
      src: "/images/tracks/monaco-circuit.jpg", 
      credit: "Circuit de Monaco - Mercedes AMG Petronas F1 Team"
    },
    {
      src: "/images/tracks/sao-paulo-circuit.jpg",
      credit: "2024 São Paulo Grand Prix – Qualifying and Race report - McLaren"
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Reduced to 5 seconds for testing

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scoringSystem = [
    { position: '1st', points: 25, color: 'text-yellow-400' },
    { position: '2nd', points: 18, color: 'text-gray-300' },
    { position: '3rd', points: 15, color: 'text-orange-400' },
    { position: '4th', points: 12, color: 'text-blue-400' },
    { position: '5th', points: 10, color: 'text-blue-400' },
    { position: '6th', points: 8, color: 'text-blue-400' },
    { position: '7th', points: 6, color: 'text-blue-400' },
    { position: '8th', points: 4, color: 'text-blue-400' },
    { position: '9th', points: 2, color: 'text-blue-400' },
    { position: '10th', points: 1, color: 'text-blue-400' },
  ];

  const raceWeekendSchedule = [
    { session: 'Free Practice 1', duration: '90 minutes', description: 'First practice session for setup and testing' },
    { session: 'Free Practice 2', duration: '90 minutes', description: 'Continued practice and long-run simulation' },
    { session: 'Free Practice 3', duration: '60 minutes', description: 'Final practice before qualifying' },
    { session: 'Qualifying', duration: '60 minutes', description: 'Three-part session determining grid positions' },
    { session: 'Race', duration: '2 hours max', description: 'Main event with championship points awarded' },
  ];

  const sprintWeekendSchedule = [
    { session: 'Free Practice 1', duration: '90 minutes', description: 'Only practice before Sprint Qualifying' },
    { session: 'Sprint Qualifying', duration: '60 minutes', description: 'Sets grid for Sprint race' },
    { session: 'Sprint', duration: '30 minutes', description: 'Short race awarding points (8-6-4-3-2-1)' },
    { session: 'Qualifying', duration: '60 minutes', description: 'Sets grid for Sunday\'s main race' },
    { session: 'Race', duration: '2 hours max', description: 'Main event with full championship points' },
  ];

  const flagMeanings = [
    { flag: '🏁', name: 'Checkered Flag', meaning: 'Race finish' },
    { flag: '🟩', name: 'Green Flag', meaning: 'Race start or restart' },
    { flag: '🟨', name: 'Yellow Flag', meaning: 'Caution - no overtaking' },
    { flag: '🟥', name: 'Red Flag', meaning: 'Session stopped' },
    { flag: '⚫', name: 'Black Flag', meaning: 'Driver disqualified' },
    { flag: '🟦', name: 'Blue Flag', meaning: 'Faster car approaching (lapped traffic)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white relative overflow-hidden">
      {/* Checkered Background */}
      <CheckeredBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16 min-h-[600px]">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[4000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-40' : 'opacity-0'
              }`}
            >
              <img
                src={image.src}
                alt={`F1 Track ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${image.src}`);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log(`Successfully loaded: ${image.src}`);
                }}
              />
              {/* Image Credit */}
              {index === currentImageIndex && (
                <div className="absolute bottom-4 left-4 text-xs text-white bg-black/60 px-3 py-2 rounded backdrop-blur-sm">
                  {image.credit}
                </div>
              )}
            </div>
          ))}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Debug Info */}
          <div className="absolute top-4 right-4 text-xs text-white bg-black/60 px-2 py-1 rounded">
            Image {currentImageIndex + 1} of {heroImages.length}
          </div>

          {/* F1 Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <img 
                src="/images/logos/f1-logo.png" 
                alt="Formula 1 Logo" 
                className="h-32 w-auto drop-shadow-2xl"
              />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-500 via-white to-red-500 bg-clip-text text-transparent">
            FORMULA 1
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The pinnacle of motorsport. Experience the thrill, understand the sport, and predict the future with AI-powered race analysis.
          </p>
        </div>
      </div>

      {/* What is Formula 1 Section */}
      <section className="relative z-10 py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
              <Trophy className="w-10 h-10 mr-4 text-yellow-400" />
              What is Formula 1?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-red-400">The Beginning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Formula 1 was founded in <strong>1950</strong> as the world's premier motorsport championship. 
                  Starting with just 7 races, it has evolved into a global spectacle featuring the fastest, 
                  most technologically advanced racing cars on the planet.
                </p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-red-400">Today's F1</h3>
                <p className="text-gray-300 leading-relaxed">
                  Modern F1 features <strong>10 teams</strong> with <strong>20 drivers</strong> competing across 
                  <strong>24 races</strong> in the 2025 season. Cars reach speeds over <strong>350 km/h</strong> 
                  while generating incredible downforce and showcasing cutting-edge technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
              <Target className="w-10 h-10 mr-4 text-green-400" />
              Scoring System
            </h2>
            
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Championship Points</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {scoringSystem.map((item, index) => (
                  <div key={index} className={`text-center p-4 bg-gray-700/50 rounded-lg ${item.color}`}>
                    <div className="text-lg font-bold">{item.position}</div>
                    <div className="text-2xl font-bold">{item.points}</div>
                    <div className="text-sm text-gray-400">points</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-600/20 rounded-lg border border-purple-500">
                <p className="text-center text-purple-200">
                  <strong>Bonus:</strong> +1 point for fastest lap (if finishing in top 10)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Race Weekend Format */}
      <section className="relative z-10 py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
              <Clock className="w-10 h-10 mr-4 text-blue-400" />
              Race Weekend Formats
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800/50 p-1 rounded-xl border border-gray-700">
                <button
                  onClick={() => setActiveWeekendTab('regular')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeWeekendTab === 'regular'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Regular Weekend
                </button>
                <button
                  onClick={() => setActiveWeekendTab('sprint')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeWeekendTab === 'sprint'
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Sprint Weekend
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            <div className="transition-all duration-300">
              {activeWeekendTab === 'regular' ? (
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-4">
                    {raceWeekendSchedule.map((session, index) => (
                      <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white">{session.session}</h4>
                          <p className="text-red-400 font-medium">{session.duration}</p>
                          <p className="text-gray-300">{session.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-orange-600/20 p-4 rounded-lg border border-orange-500 mb-6">
                    <p className="text-center text-orange-200 text-sm">
                      <strong>6 weekends per season</strong> with additional Sprint race on Saturday
                    </p>
                  </div>
                  <div className="space-y-4">
                    {sprintWeekendSchedule.map((session, index) => (
                      <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6 ${
                          session.session === 'Sprint' ? 'bg-orange-600' : 'bg-red-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white">{session.session}</h4>
                          <p className={`font-medium ${session.session === 'Sprint' ? 'text-orange-400' : 'text-red-400'}`}>
                            {session.duration}
                          </p>
                          <p className="text-gray-300">{session.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Penalties & Flags */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
              <Flag className="w-10 h-10 mr-4 text-yellow-400" />
              Flags & Penalties
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Flags */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">Race Flags</h3>
                <div className="space-y-3">
                  {flagMeanings.map((flag, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-2xl">{flag.flag}</span>
                      <div>
                        <div className="font-bold text-white">{flag.name}</div>
                        <div className="text-gray-300 text-sm">{flag.meaning}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Penalties */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-orange-400">Common Penalties</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="font-bold text-white">5-Second Penalty</div>
                    <div className="text-gray-300 text-sm">Minor infractions (unsafe release, track limits)</div>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="font-bold text-white">10-Second Penalty</div>
                    <div className="text-gray-300 text-sm">More serious infractions (causing collision)</div>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="font-bold text-white">Grid Penalty</div>
                    <div className="text-gray-300 text-sm">Engine changes, gearbox penalties</div>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="font-bold text-white">Disqualification</div>
                    <div className="text-gray-300 text-sm">Serious rule violations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center flex items-center justify-center">
              <BarChart3 className="w-10 h-10 mr-4 text-purple-400" />
              Formula 1 Legends
            </h2>
            <StatisticsTable />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready for More?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Dive deeper into the official Formula 1 world with live timing, exclusive content, and behind-the-scenes access.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Official F1 Website */}
              <a
                href="https://www.formula1.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <ExternalLink className="w-8 h-8 mb-3" />
                <span className="text-lg">Official F1 Website</span>
                <span className="text-sm text-red-200 mt-1">News, standings & more</span>
              </a>

              {/* F1 YouTube Channel */}
              <a
                href="https://www.youtube.com/@Formula1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-lg">F1 YouTube</span>
                <span className="text-sm text-red-200 mt-1">Highlights & behind-the-scenes</span>
              </a>

              {/* F1 TV */}
              <a
                href="https://f1tv.formula1.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 8.64L13.77 12L8.5 15.36V8.64M6.5 5v14l11-7L6.5 5z"/>
                </svg>
                <span className="text-lg">F1 TV</span>
                <span className="text-sm text-red-200 mt-1">Live races & exclusive content</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;