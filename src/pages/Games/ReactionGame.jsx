import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, RotateCcw } from 'lucide-react';
import { gameService } from '../../services/gameService';

export default function ReactionGame() {
  const [gameState, setGameState] = useState('idle'); // idle, waiting, playing, finished
  const [message, setMessage] = useState('Click start to begin');
  const [bgColor, setBgColor] = useState('bg-slate-100');
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);

  const startGame = () => {
    setGameState('waiting');
    setMessage('Wait for green...');
    setBgColor('bg-red-500');
    setReactionTime(null);

    // Random delay between 2 and 5 seconds
    const delay = Math.random() * 3000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('playing');
      setMessage('CLICK NOW!');
      setBgColor('bg-emerald-500');
      setStartTime(performance.now());
    }, delay);
  };

  const handleInteraction = () => {
    if (gameState === 'waiting') {
      clearTimeout(timeoutRef.current);
      setGameState('finished');
      setMessage('Too early! Wait for the green color.');
      setBgColor('bg-rose-100');
    } else if (gameState === 'playing') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setReactionTime(time);
      setGameState('finished');
      setMessage(`Your reaction time: ${time} ms`);
      setBgColor('bg-blue-50');
      
      // Save result (lower reaction time = higher score, max 100)
      const score = Math.max(100 - Math.floor(time / 10), 0);
      gameService.saveGameSession('Reaction Time', score, time);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold flex items-center text-slate-800">
            <Clock className="mr-2 h-6 w-6 text-teal-600" /> Reaction Time Test
          </h2>
          <p className="text-sm text-slate-500">Measure your visual reflex speed</p>
        </div>
        <button 
          onClick={startGame} 
          className="btn-secondary flex items-center mt-4 sm:mt-0"
          disabled={gameState === 'waiting' || gameState === 'playing'}
        >
          {gameState === 'finished' ? <RotateCcw className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {gameState === 'finished' ? 'Try Again' : 'Start Test'}
        </button>
      </div>

      <div 
        className={`h-96 w-full rounded-2xl flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer shadow-inner border border-slate-200 ${bgColor} select-none`}
        onClick={handleInteraction}
      >
        <h1 className={`text-4xl md:text-5xl font-bold text-center ${gameState === 'playing' ? 'text-white' : gameState === 'waiting' ? 'text-white' : 'text-slate-700'}`}>
          {message}
        </h1>
        {gameState === 'idle' && (
           <p className="mt-4 text-slate-500 text-center max-w-sm">
             When the red box turns green, tap or click as quickly as you can.
           </p>
        )}
        {reactionTime && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-slate-800 font-semibold shadow-sm text-lg">
            Result saved to profile.
          </div>
        )}
      </div>
      
      <div className="mt-8 border-t border-slate-200 pt-6 px-4">
        <h3 className="font-semibold text-slate-700 mb-2">Did you know?</h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
          Average human reaction time is around 250 milliseconds to visual stimuli. Monitoring changes in reaction time over weeks and months can serve as a sensitive indicator for underlying neurological health and cognitive processing speed.
        </p>
      </div>
    </div>
  );
}