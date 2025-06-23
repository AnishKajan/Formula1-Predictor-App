import React from 'react';
import { Trophy, Target, Zap, Calendar } from 'lucide-react';

interface Driver {
  name: string;
  number: number;
  country: string;
  age: number;
  image: string;
  championships: number;
  wins: number;
  podiums: number;
  debut: number;
}

interface DriverCardProps {
  driver: Driver;
  teamColor: string;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver, teamColor }) => {
  // Function to get appropriate career description based on driver experience and achievements
  const getCareerDescription = (driver: Driver) => {
    const currentYear = 2025;
    const yearsOfExperience = currentYear - driver.debut;
    
    // Special cases for specific drivers with unique circumstances
    if (driver.name === 'Nico Hülkenberg') {
      return '🏁 Veteran F1 driver with 15+ years experience';
    }
    
    if (driver.name === 'Lewis Hamilton') {
      return '👑 7x World Champion and F1 legend';
    }
    
    if (driver.name === 'Fernando Alonso') {
      return '🎯 2x World Champion still racing at 43';
    }
    
    if (driver.name === 'Max Verstappen') {
      return '🏆 4x World Champion and current title holder';
    }
    
    // General logic based on achievements and experience
    if (driver.championships > 0) {
      return `🏆 ${driver.championships}x World Champion`;
    } else if (driver.wins > 0) {
      return `🏁 ${driver.wins} Grand Prix winner${driver.wins !== 1 ? 's' : ''}`;
    } else if (driver.podiums > 0) {
      return `🥉 ${driver.podiums} career podium${driver.podiums !== 1 ? 's' : ''}`;
    } else if (yearsOfExperience >= 5) {
      return '🎯 Experienced F1 competitor';
    } else if (yearsOfExperience >= 2) {
      return '⚡ Developing F1 talent';
    } else {
      return '🚀 Rising talent in Formula 1';
    }
  };

  // Function to determine if we need light or dark text based on team color
  const getTextColor = (color: string) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:scale-105 transition-all duration-300 group">
      {/* Driver Header */}
      <div className="relative">
        <div 
          className="h-2 w-full"
          style={{ backgroundColor: teamColor }}
        ></div>
        
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{driver.country}</span>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {driver.name}
                </h3>
                <div className="flex items-center space-x-4 text-gray-400">
                  <p>Age: {driver.age}</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Debut: {driver.debut}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Driver Number - Now uses team color */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-4 border-white"
              style={{ 
                backgroundColor: teamColor,
                color: getTextColor(teamColor)
              }}
            >
              {driver.number}
            </div>
          </div>

          {/* Driver Photo */}
          <div className="mb-6 text-center">
            <div className="inline-block p-4 bg-gray-700/50 rounded-xl">
              <img
                src={driver.image}
                alt={driver.name}
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" fill="${encodeURIComponent(teamColor)}30"/><text x="64" y="64" text-anchor="middle" fill="white" font-size="16" font-family="Arial">${driver.name.split(' ').map(n => n[0]).join('')}</text></svg>`;
                }}
              />
            </div>
          </div>

          {/* Driver Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{driver.championships}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Championships</div>
            </div>
            
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{driver.wins}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Wins</div>
            </div>
            
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{driver.podiums}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Podiums</div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Highlight */}
      <div className="px-6 pb-6">
        <div className="mt-4 p-3 bg-black/30 rounded-lg border-l-4" style={{ borderColor: teamColor }}>
          <p className="text-sm text-gray-300">
            {getCareerDescription(driver)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;