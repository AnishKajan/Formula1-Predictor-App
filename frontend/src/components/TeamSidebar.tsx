import React from 'react';

interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
}

interface TeamSidebarProps {
  teams: Team[];
  selectedTeam: string;
  onTeamSelect: (teamId: string) => void;
}

const TeamSidebar: React.FC<TeamSidebarProps> = ({ teams, selectedTeam, onTeamSelect }) => {
  const getTeamLogo = (teamId: string) => {
    const logoMap: Record<string, string> = {
      'red-bull': '/images/logos/red-bull-logo.png',
      'ferrari': '/images/logos/ferrari-logo.png',
      'mercedes': '/images/logos/mercedes-logo.png',
      'mclaren': '/images/logos/mclaren-logo-black.png',
      'aston-martin': '/images/logos/aston-martin-logo.png',
      'alpine': '/images/logos/alpine-logo.png',
      'williams': '/images/logos/williams-logo.png',
      'rb': '/images/logos/rb-logo.png',
      'haas': '/images/logos/haas-logo.png',
      'kick-sauber': '/images/logos/sauber-logo.png'
    };
    return logoMap[teamId] || '/images/logos/f1-logo.png';
  };

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 z-40 overflow-y-auto pt-20">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">2025 F1 Teams</h2>
        
        <div className="space-y-3">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onTeamSelect(team.id)}
              className={`w-full p-4 rounded-xl transition-all duration-300 border-2 ${
                selectedTeam === team.id
                  ? 'border-white bg-white/10 scale-105 shadow-xl'
                  : 'border-transparent bg-gray-800/50 hover:bg-gray-700/50 hover:scale-102'
              }`}
              style={{
                background: selectedTeam === team.id 
                  ? `linear-gradient(135deg, ${team.color}20, ${team.secondaryColor}20)`
                  : undefined
              }}
            >
              <div className="flex items-center space-x-4">
                {/* Team Logo on Colored Background */}
                <div className="relative">
                  {/* Colored square background */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: team.color }}
                  >
                    {/* Logo */}
                    <img
                      src={getTeamLogo(team.id)}
                      alt={`${team.shortName} logo`}
                      className="w-10 h-10 object-contain z-10 relative"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${encodeURIComponent(team.secondaryColor)}"/><text x="20" y="25" text-anchor="middle" fill="${encodeURIComponent(team.color)}" font-size="12" font-family="Arial" font-weight="bold">${team.shortName.substring(0, 3)}</text></svg>`;
                      }}
                    />
                    
                    {/* Secondary color accent */}
                    <div 
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-tl-lg"
                      style={{ backgroundColor: team.secondaryColor }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex-1 text-left">
                  <div className="font-bold text-white text-lg">{team.shortName}</div>
                  <div className="text-gray-300 text-sm truncate">{team.name}</div>
                </div>
                
                {/* Selected Indicator */}
                {selectedTeam === team.id && (
                  <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {/* Championship Info */}
        <div className="mt-8 p-4 bg-red-600/20 rounded-xl border border-red-500">
          <h3 className="font-bold text-red-400 mb-2">2024 Champions</h3>
          <div className="text-sm text-gray-300">
            <div>🏆 Drivers: Max Verstappen</div>
            <div>🏆 Constructors: McLaren</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSidebar;