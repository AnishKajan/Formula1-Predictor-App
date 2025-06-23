import React, { useState } from 'react';
import { Trophy, Target, Zap, Crown } from 'lucide-react';

const StatisticsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wins' | 'podiums' | 'poles' | 'championships'>('wins');

  const statistics = {
    wins: [
      { driver: "Lewis Hamilton", count: 103, years: "2007-2021", flag: "🇬🇧" },
      { driver: "Michael Schumacher", count: 91, years: "1991-2006", flag: "🇩🇪" },
      { driver: "Max Verstappen", count: 61, years: "2016-2024", flag: "🇳🇱" },
      { driver: "Sebastian Vettel", count: 53, years: "2007-2022", flag: "🇩🇪" },
      { driver: "Alain Prost", count: 51, years: "1980-1993", flag: "🇫🇷" }
    ],
    podiums: [
      { driver: "Lewis Hamilton", count: 201, years: "2007-2021", flag: "🇬🇧" },
      { driver: "Michael Schumacher", count: 155, years: "1991-2006", flag: "🇩🇪" },
      { driver: "Sebastian Vettel", count: 122, years: "2007-2022", flag: "🇩🇪" },
      { driver: "Max Verstappen", count: 104, years: "2016-2024", flag: "🇳🇱" },
      { driver: "Fernando Alonso", count: 98, years: "2001-2024", flag: "🇪🇸" }
    ],
    poles: [
      { driver: "Lewis Hamilton", count: 104, years: "2007-2021", flag: "🇬🇧" },
      { driver: "Michael Schumacher", count: 68, years: "1991-2006", flag: "🇩🇪" },
      { driver: "Ayrton Senna", count: 65, years: "1984-1994", flag: "🇧🇷" },
      { driver: "Sebastian Vettel", count: 57, years: "2007-2022", flag: "🇩🇪" },
      { driver: "Max Verstappen", count: 40, years: "2016-2024", flag: "🇳🇱" }
    ],
    championships: [
      { driver: "Lewis Hamilton", count: 7, years: "2008, 2014-2015, 2017-2020", flag: "🇬🇧" },
      { driver: "Michael Schumacher", count: 7, years: "1994-1995, 2000-2004", flag: "🇩🇪" },
      { driver: "Juan Manuel Fangio", count: 5, years: "1951, 1954-1957", flag: "🇦🇷" },
      { driver: "Max Verstappen", count: 4, years: "2021-2024", flag: "🇳🇱" },
      { driver: "Alain Prost", count: 4, years: "1985-1986, 1989, 1993", flag: "🇫🇷" }
    ]
  };

  const tabs = [
    { id: 'wins', label: 'Most Wins', icon: Trophy, color: 'text-yellow-400' },
    { id: 'podiums', label: 'Most Podiums', icon: Target, color: 'text-orange-400' },
    { id: 'poles', label: 'Most Poles', icon: Zap, color: 'text-purple-400' },
    { id: 'championships', label: 'Most Titles', icon: Crown, color: 'text-green-400' }
  ];

  const getPositionColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black';
      case 1: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-black';
      case 2: return 'bg-gradient-to-r from-orange-500 to-orange-600 text-black';
      default: return 'bg-gray-700 text-white';
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-red-600 text-white scale-105'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Statistics Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="bg-gray-900/50 p-4 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-center flex items-center justify-center">
            {tabs.find(tab => tab.id === activeTab)?.icon && (
              <span className="mr-3">
                {React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                  className: `w-7 h-7 ${tabs.find(tab => tab.id === activeTab)!.color}`
                })}
              </span>
            )}
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-300 uppercase tracking-wider">
                  {activeTab === 'wins' ? 'Wins' : 
                   activeTab === 'podiums' ? 'Podiums' : 
                   activeTab === 'poles' ? 'Poles' : 'Championships'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Years Active
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {statistics[activeTab].map((driver, index) => (
                <tr
                  key={driver.driver}
                  className="hover:bg-gray-700/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${getPositionColor(index)}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{driver.flag}</span>
                      <span className="font-medium text-white text-lg">{driver.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-2xl font-bold text-red-400">{driver.count}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {driver.years}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Statistics include all Formula 1 races from 1950 to 2024 season</p>
      </div>
    </div>
  );
};

export default StatisticsTable;