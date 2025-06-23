import React, { useState, useEffect, useRef } from 'react';
import TeamDetails from './TeamDetails';

interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
}

const CurrentSeason: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('red-bull');
  const [isMobile, setIsMobile] = useState(false);
  
  // Add refs to control scroll independently
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null); // Add mobile scroll ref

  const teams: Team[] = [
    {
      id: 'red-bull',
      name: 'Oracle Red Bull Racing',
      shortName: 'Red Bull',
      color: '#0600EF',
      secondaryColor: '#DC143C'
    },
    {
      id: 'ferrari',
      name: 'Scuderia Ferrari',
      shortName: 'Ferrari',
      color: '#DC0000',
      secondaryColor: '#FFF200'
    },
    {
      id: 'mercedes',
      name: 'Mercedes-AMG Petronas',
      shortName: 'Mercedes',
      color: '#00D2BE',
      secondaryColor: '#000000'
    },
    {
      id: 'mclaren',
      name: 'McLaren Formula 1 Team',
      shortName: 'McLaren',
      color: '#FF8700',
      secondaryColor: '#000000'
    },
    {
      id: 'aston-martin',
      name: 'Aston Martin Aramco',
      shortName: 'Aston Martin',
      color: '#006F62',
      secondaryColor: '#CEDC00'
    },
    {
      id: 'alpine',
      name: 'BWT Alpine F1 Team',
      shortName: 'Alpine',
      color: '#0090FF',
      secondaryColor: '#FF87BC'
    },
    {
      id: 'williams',
      name: 'Atlassian Williams Racing',
      shortName: 'Williams',
      color: '#005AFF',
      secondaryColor: '#FFFFFF'
    },
    {
      id: 'rb',
      name: 'Visa Cash App RB',
      shortName: 'RB',
      color: '#6692FF',
      secondaryColor: '#C8102E'
    },
    {
      id: 'haas',
      name: 'MoneyGram Haas F1 Team',
      shortName: 'Haas',
      color: '#FFFFFF',
      secondaryColor: '#787878'
    },
    {
      id: 'kick-sauber',
      name: 'Stake F1 Team Kick Sauber',
      shortName: 'Kick Sauber',
      color: '#52E252',
      secondaryColor: '#000000'
    }
  ];

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle team selection with independent scrolling for both desktop and mobile
  const handleTeamSelect = (teamId: string) => {
    // Store current scroll positions
    const currentSidebarScrollTop = sidebarRef.current?.scrollTop || 0;
    const currentMobileScrollLeft = mobileScrollRef.current?.scrollLeft || 0;
    
    setSelectedTeam(teamId);
    
    // Only scroll the main content to top, not the sidebar or mobile selector
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Restore scroll positions after state update
    requestAnimationFrame(() => {
      if (sidebarRef.current && !isMobile) {
        sidebarRef.current.scrollTop = currentSidebarScrollTop;
      }
      if (mobileScrollRef.current && isMobile) {
        mobileScrollRef.current.scrollLeft = currentMobileScrollLeft;
      }
    });
  };

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

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div 
      ref={sidebarRef}
      className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 z-40 overflow-y-auto pt-20"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">2025 F1 Teams</h2>
        
        <div className="space-y-3">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={(e) => {
                e.preventDefault();
                handleTeamSelect(team.id);
              }}
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
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: team.color }}
                  >
                    <img
                      src={getTeamLogo(team.id)}
                      alt={`${team.shortName} logo`}
                      className="w-10 h-10 object-contain z-10 relative"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${encodeURIComponent(team.secondaryColor)}"/><text x="20" y="25" text-anchor="middle" fill="${encodeURIComponent(team.color)}" font-size="12" font-family="Arial" font-weight="bold">${team.shortName.substring(0, 3)}</text></svg>`;
                      }}
                    />
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

  // Mobile Team Selector Component
  const MobileTeamSelector = () => (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-16 z-30">
      <h2 className="text-xl font-bold text-white mb-4 text-center">2025 F1 Teams</h2>
      <div 
        ref={mobileScrollRef}
        className="overflow-x-auto"
      >
        <div className="flex space-x-3 pb-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={(e) => {
                e.preventDefault();
                handleTeamSelect(team.id);
              }}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 border-2 min-w-[140px] ${
                selectedTeam === team.id
                  ? 'border-white bg-white/10 shadow-lg scale-105'
                  : 'border-transparent bg-gray-800/50'
              }`}
              style={{
                background: selectedTeam === team.id 
                  ? `linear-gradient(135deg, ${team.color}20, ${team.secondaryColor}20)`
                  : undefined
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: team.color }}
                >
                  <img
                    src={getTeamLogo(team.id)}
                    alt={`${team.shortName} logo`}
                    className="w-8 h-8 object-contain z-10 relative"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${encodeURIComponent(team.secondaryColor)}"/><text x="16" y="20" text-anchor="middle" fill="${encodeURIComponent(team.color)}" font-size="10" font-family="Arial" font-weight="bold">${team.shortName.substring(0, 3)}</text></svg>`;
                    }}
                  />
                  <div 
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-tl-lg"
                    style={{ backgroundColor: team.secondaryColor }}
                  ></div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-sm">{team.shortName}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Conditional rendering based on screen size */}
      {!isMobile && <DesktopSidebar />}
      {isMobile && <MobileTeamSelector />}
      
      {/* Main Content Area */}
      <div className={`min-h-screen pt-20 ${!isMobile ? 'ml-80' : ''}`}>
        <div 
          ref={mainContentRef}
          className="overflow-y-auto h-[calc(100vh-5rem)]"
        >
          <TeamDetails selectedTeam={selectedTeam} />
        </div>
      </div>
    </div>
  );
};

export default CurrentSeason;