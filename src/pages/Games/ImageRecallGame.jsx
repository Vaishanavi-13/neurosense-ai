import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Play, RotateCcw } from 'lucide-react';
import { gameService } from '../../services/gameService';

const IMAGES = [
  { emoji: '🍎', name: 'apple' },
  { emoji: '🚗', name: 'car' },
  { emoji: '🐶', name: 'dog' },
  { emoji: '🌳', name: 'tree' },
  { emoji: '🏠', name: 'house' }
];

export default function ImageRecallGame() {
  const [gameState, setGameState] = useState('idle'); // 'idle', 'memorizing', 'recalling', 'finished'
  const [countdown, setCountdown] = useState(5);
  const [userInputs, setUserInputs] = useState(['', '', '', '', '']);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const startGame = () => {
    setCountdown(5);
    setUserInputs(['', '', '', '', '']);
    setScore(0);
    setGameState('memorizing');
  };

  useEffect(() => {
    let timer;
    if (gameState === 'memorizing') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setGameState('recalling');
        setStartTime(Date.now());
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, gameState]);

  const handleInputChange = (index, value) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  const submitAnswers = (e) => {
    e.preventDefault();
    if (gameState !== 'recalling') return;

    let correctCount = 0;
    const cleanAnswers = userInputs.map(input => input.trim().toLowerCase());
    
    // Check ignoring order
    const imageNames = IMAGES.map(img => img.name);
    cleanAnswers.forEach(answer => {
      if (imageNames.includes(answer)) {
        correctCount++;
        // Remove from list to prevent duplicate counting
        const idx = imageNames.indexOf(answer);
        imageNames.splice(idx, 1);
      }
    });

    setScore(correctCount);
    setGameState('finished');
    
    const timeTaken = Date.now() - startTime;
    gameService.saveGameSession('Image Recall', correctCount * 20, timeTaken);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-shrink-0 mb-4 z-10">
        <div>
          <h2 className="text-xl font-bold flex items-center text-slate-800">
            <ImageIcon className="mr-2 h-6 w-6 text-orange-500" /> Image Recall
          </h2>
          <p className="text-sm text-slate-500 hidden sm:block">Memorize and recall the images</p>
        </div>
        
        <button 
          onClick={startGame} 
          className="btn-primary flex items-center py-1.5 px-4 text-sm mt-2 sm:mt-0"
          disabled={gameState === 'memorizing'}
        >
          {gameState === 'idle' ? <Play className="h-4 w-4 mr-1.5" /> : <RotateCcw className="h-4 w-4 mr-1.5" />}
          {gameState === 'idle' ? 'Start' : 'Restart'}
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center relative bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-6 overflow-y-auto">
        {gameState === 'idle' && (
           <div className="text-center max-w-md">
              <ImageIcon className="h-16 w-16 text-orange-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Visual Memory Assessment</h3>
              <p className="text-slate-500 mb-6 text-lg">
                You will be shown 5 images for 5 seconds. Remember them. Afterwards, type the names of the images you can recall.
              </p>
              <button onClick={startGame} className="btn-primary px-8 text-lg w-full sm:w-auto">Begin Test</button>
           </div>
        )}

        {gameState === 'memorizing' && (
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Memorize the items below</h3>
            <div className="w-16 h-16 rounded-full border-4 border-orange-100 flex items-center justify-center mb-6 shadow-sm relative">
               <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-orange-500/20" />
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="176" strokeDashoffset={176 - (176 * countdown) / 5} className="text-orange-500 transition-all duration-1000 linear" />
               </svg>
               <span className="text-2xl font-bold text-orange-600 relative z-10">{countdown}</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 w-full max-w-2xl px-4">
              {IMAGES.map((img, i) => (
                 <div key={i} className="aspect-square bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                   <span className="text-6xl sm:text-7xl drop-shadow-sm mb-2">{img.emoji}</span>
                 </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'recalling' && (
          <div className="w-full max-w-lg mx-auto flex flex-col">
             <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">Recall Phase</h3>
             <p className="text-slate-500 text-center mb-8">What images do you remember seeing? Order does not matter.</p>
             
             <form onSubmit={submitAnswers} className="flex flex-col space-y-4">
               {userInputs.map((val, i) => (
                 <input 
                   key={i}
                   type="text"
                   value={val}
                   onChange={(e) => handleInputChange(i, e.target.value)}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white outline-none text-lg text-slate-700 shadow-sm transition-all"
                   placeholder={`Item ${i + 1}`}
                   autoFocus={i === 0}
                 />
               ))}
               
               <button 
                 type="submit" 
                 className="btn-primary py-4 text-lg mt-4 bg-orange-500 hover:bg-orange-600"
               >
                 Submit Answers
               </button>
             </form>
          </div>
        )}

        {gameState === 'finished' && (
           <div className="text-center">
              <div className="inline-flex h-24 w-24 rounded-full bg-emerald-50 border-4 border-emerald-100 items-center justify-center mb-6 shadow-sm">
                 <span className="text-4xl font-bold text-emerald-600">{score}<span className="text-xl text-emerald-400">/5</span></span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Test Complete</h3>
              <p className="text-slate-500 text-lg mb-8 max-w-sm mx-auto">
                {score === 5 ? "Perfect recall! Your visual memory is excellent." : "Good effort. Regular testing helps chart your baseline."}
              </p>
              <button onClick={startGame} className="btn-outline px-8 text-lg">Test Again</button>
           </div>
        )}
      </div>
    </div>
  );
}
