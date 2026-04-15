import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Image as ImageIcon, Brain, ArrowRight, Info, ArrowLeft } from 'lucide-react';
import Card from '../../components/Card';
import { gameService } from '../../services/gameService';
import { useApp } from '../../hooks/useApp';

export default function Games() {
  const { t } = useApp();
  const [hasPlayed, setHasPlayed] = useState(true);

  useEffect(() => {
    setHasPlayed(gameService.hasPlayedGames());
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <Link 
        to="/dashboard"
        className="flex items-center text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> {t.back_to_dashboard}
      </Link>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <Gamepad2 className="mr-2 h-6 w-6 text-primary-600 dark:text-primary-400" /> {t.games}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t.games_desc}</p>
      </div>

      {!hasPlayed && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 rounded-xl p-4 flex items-center shadow-sm">
          <Info className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
           <p className="font-medium">{t.welcome_games}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:shadow-md flex flex-col h-full cursor-pointer group">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 align-middle">
            <Gamepad2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.memory_match}</h3>
          <p className="text-slate-600 dark:text-slate-400 flex-1">
            {t.memory_match_desc}
          </p>
          <Link to="/dashboard/games/memory" className="btn-primary mt-6 group-hover:bg-primary-700 w-full flex items-center justify-center">
            {t.play_now} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>

        <Card className="hover:border-orange-200 dark:hover:border-orange-800 transition-all hover:shadow-md flex flex-col h-full cursor-pointer group">
          <div className="h-16 w-16 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 flex items-center justify-center mb-6 align-middle">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.image_recall}</h3>
          <p className="text-slate-600 dark:text-slate-400 flex-1">
            {t.image_recall_desc}
          </p>
          <Link to="/dashboard/games/image-recall" className="btn-primary mt-6 group-hover:bg-primary-700 w-full flex items-center justify-center">
            {t.play_now} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>

        <Card className="hover:border-purple-200 dark:hover:border-purple-800 transition-all hover:shadow-md flex flex-col h-full cursor-pointer group">
          <div className="h-16 w-16 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 align-middle">
            <Brain className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.word_recall}</h3>
          <p className="text-slate-600 dark:text-slate-400 flex-1">
            {t.word_recall_desc}
          </p>
          <Link to="/dashboard/games/recall" className="btn-primary mt-6 group-hover:bg-primary-700 w-full flex items-center justify-center">
            {t.play_now} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
