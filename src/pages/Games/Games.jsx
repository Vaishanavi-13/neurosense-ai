import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Clock, Brain, ArrowRight, Info } from 'lucide-react';
import Card from '../../components/Card';
import { gameService } from '../../services/gameService';

export default function Games() {
  const [hasPlayed, setHasPlayed] = useState(true);

  useEffect(() => {
    setHasPlayed(gameService.hasPlayedGames());
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Gamepad2 className="mr-2 h-6 w-6 text-primary-600" /> Cognitive Games
        </h2>
        <p className="text-slate-500">Select an assessment to evaluate your cognitive skills.</p>
      </div>

      {!hasPlayed && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 flex items-center shadow-sm">
          <Info className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
           <p className="font-medium">Welcome! Start your first cognitive game below to begin tracking your health data.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-blue-200 transition-all hover:shadow-md flex flex-col h-full cursor-pointer group">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 align-middle">
            <Gamepad2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Memory Match</h3>
          <p className="text-slate-600 flex-1">
            Test your short-term visual memory by finding matching pairs of cards in the fewest moves possible.
          </p>
          <Link to="/dashboard/games/memory" className="btn-primary mt-6 group-hover:bg-primary-700 w-full flex items-center justify-center">
            Play Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>

        <Card className="hover:border-teal-200 transition-all hover:shadow-md flex flex-col h-full cursor-pointer group">
          <div className="h-16 w-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 align-middle">
            <Clock className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Reaction Time</h3>
          <p className="text-slate-600 flex-1">
            Measures your visual reflexes and processing speed. Click the screen as soon as the color changes.
          </p>
          <Link to="/dashboard/games/reaction" className="btn-secondary mt-6 group-hover:bg-secondary-600 w-full flex items-center justify-center">
            Play Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>

        <Card className="hover:border-purple-200 transition-all hover:shadow-md flex flex-col h-full cursor-pointer group">
          <div className="h-16 w-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 align-middle">
            <Brain className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Word Recall</h3>
          <p className="text-slate-600 flex-1">
            Evaluate your short-term linguistic memory by memorizing a sequence of words and recalling them.
          </p>
          <Link to="/dashboard/games/recall" className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors font-medium shadow-sm mt-6 w-full flex items-center justify-center active:scale-95">
            Play Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
