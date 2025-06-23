import React from 'react';
import { Scale, Shield, ExternalLink } from 'lucide-react';

const LegalFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900/95 border-t border-gray-700 text-gray-300 py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* Main Legal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Trademark Disclaimer */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-red-400 font-semibold">
              <Scale className="w-5 h-5" />
              <h3>Trademark & Copyright Notice</h3>
            </div>
            <div className="text-sm leading-relaxed space-y-2">
              <p>
                Formula 1®, F1®, FIA FORMULA ONE WORLD CHAMPIONSHIP™, GRAND PRIX™ and related marks 
                are trademarks of Formula One Licensing B.V., a Formula 1 company. All rights reserved.
              </p>
              <p>
                Team names, logos, driver names, and all related imagery are trademarks and intellectual 
                property of their respective owners, including but not limited to:
              </p>
              <ul className="text-xs text-gray-400 grid grid-cols-2 gap-1 mt-2">
                <li>• Red Bull Racing</li>
                <li>• Scuderia Ferrari</li>
                <li>• Mercedes-AMG Petronas</li>
                <li>• McLaren F1 Team</li>
                <li>• Aston Martin F1</li>
                <li>• BWT Alpine F1 Team</li>
                <li>• Williams Racing</li>
                <li>• Visa Cash App RB</li>
                <li>• MoneyGram Haas F1</li>
                <li>• Stake F1 Kick Sauber</li>
              </ul>
            </div>
          </div>

          {/* Fair Use & Educational Purpose */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold">
              <Shield className="w-5 h-5" />
              <h3>Fair Use & Educational Purpose</h3>
            </div>
            <div className="text-sm leading-relaxed space-y-2">
              <p>
                This application is created for <strong>educational, analytical, and non-commercial purposes</strong> only. 
                The use of F1-related trademarks, logos, and imagery falls under fair use provisions for:
              </p>
              <ul className="text-xs text-gray-400 space-y-1 ml-4">
                <li>• Educational content and learning purposes</li>
                <li>• Statistical analysis and data visualization</li>
                <li>• Fan engagement and community discussion</li>
                <li>• Technical demonstration of prediction algorithms</li>
              </ul>
              <p className="text-xs text-gray-400 italic">
                No commercial gain is derived from this application. This is an independent fan project 
                and is not affiliated with, endorsed by, or connected to Formula 1, the FIA, or any F1 teams.
              </p>
            </div>
          </div>
        </div>

        {/* Official Links */}
        <div className="border-t border-gray-700 pt-6 mb-6">
          <div className="flex items-center space-x-2 text-gray-400 mb-3">
            <ExternalLink className="w-4 h-4" />
            <h4 className="font-medium">Official F1 Resources</h4>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a 
              href="https://www.formula1.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Official F1 Website
            </a>
            <a 
              href="https://www.fia.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              FIA Official Website
            </a>
            <a 
              href="https://f1tv.formula1.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              F1 TV Official
            </a>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-xs text-gray-500">
              <p>
                <strong>Disclaimer:</strong> This is an unofficial fan-created application. 
                Predictions are for entertainment purposes only and should not be used for gambling or betting. 
                All statistics and data are sourced from publicly available information.
              </p>
            </div>
            <div className="text-xs text-gray-500 md:text-right">
              <p>© {new Date().getFullYear()} F1 Race Predictor</p>
              <p>Educational Use Only • Not for Commercial Use</p>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-center">
            <p>
              <strong>Data Sources:</strong> Publicly available F1 statistics, race results, and team information. 
              This application does not store or redistribute copyrighted content.
            </p>
            <p className="mt-1">
              For official F1 news, results, and content, please visit the official Formula 1 website.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;