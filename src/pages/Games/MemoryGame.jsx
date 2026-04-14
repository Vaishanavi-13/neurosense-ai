import React, { useState, useEffect } from 'react';
import { Gamepad2, Play, RotateCcw } from 'lucide-react';
import { gameService } from '../../services/gameService';

const ALL_CARDS = ['🧠', '🧬', '💊', '🩺', '🔬', '🏥', '🚑', '👨‍⚕️', '🍎', '🚗'];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  
  // Grid size selection: 'small' = 4x3 (12 cards/6 pairs), 'large' = 4x4 (16 cards/8 pairs)
  const [gridSize, setGridSize] = useState('small'); 

  const generateCards = (size) => {
    const pairCount = size === 'small' ? 6 : 8;
    const selectedEmojis = ALL_CARDS.slice(0, pairCount);
    const duplicated = [...selectedEmojis, ...selectedEmojis];
    return duplicated.sort(() => Math.random() - 0.5).map((emoji, index) => ({ id: index, emoji }));
  };

  const startGame = () => {
    setCards(generateCards(gridSize));
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setIsPlaying(true);
    setWon(false);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const match = cards[flipped[0]].emoji === cards[flipped[1]].emoji;
      if (match) {
        setSolved(prev => [...prev, flipped[0], flipped[1]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (isPlaying && solved.length === cards.length && solved.length > 0 && !won) {
      setWon(true);
      setIsPlaying(false);
      
      const timeTakenMs = Date.now() - startTime;
      const finalScore = Math.max(100 - (moves * 2), 10);
      gameService.saveGameSession(`Memory Match (${gridSize === 'small' ? '4x3' : '4x4'})`, finalScore, timeTakenMs);
    }
  }, [solved, won, moves, startTime, cards.length, isPlaying, gridSize]);

  const handleCardClick = (index) => {
    if (!isPlaying || flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
    setFlipped(prev => [...prev, index]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-shrink-0 mb-4 z-10">
        <div>
          <h2 className="text-xl font-bold flex items-center text-slate-800">
            <Gamepad2 className="mr-2 h-6 w-6 text-primary-600" /> Memory Match
          </h2>
          <p className="text-sm text-slate-500 hidden sm:block">Find all the matching pairs</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {!isPlaying && !won && (
            <select 
              value={gridSize} 
              onChange={(e) => setGridSize(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="small">Small (4x3)</option>
              <option value="large">Large (4x4)</option>
            </select>
          )}

          {isPlaying && (
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">MOVES</p>
              <p className="text-xl font-bold text-slate-800 leading-none">{moves}</p>
            </div>
          )}

          <button 
            onClick={startGame} 
            className="btn-primary flex items-center py-1.5 px-4 text-sm"
          >
            {isPlaying || won ? <RotateCcw className="h-4 w-4 mr-1.5" /> : <Play className="h-4 w-4 mr-1.5" />}
            {isPlaying || won ? 'Restart' : 'Start'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center relative">
        {!isPlaying && !won && (
           <div className="w-full h-full max-h-72 flex flex-col items-center justify-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center">
              <Gamepad2 className="h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-xl font-bold text-slate-700">Test your memory</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-sm">
                Select your grid size and find matches with the fewest moves possible.
              </p>
           </div>
        )}

        {won && (
           <div className="w-full h-full max-h-72 flex flex-col items-center justify-center bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-6 text-center">
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">Excellent Work!</h3>
              <p className="text-emerald-600">Completed in {moves} moves.</p>
              <p className="text-emerald-500 text-sm mt-1">Score saved to profile.</p>
           </div>
        )}

        {isPlaying && (
          <div className={`grid w-full h-full p-2 gap-2 sm:gap-3 
            ${gridSize === 'small' ? 'grid-cols-4 grid-rows-3' : 'grid-cols-4 grid-rows-4'}`}
          >
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || solved.includes(index);
              return (
                <div 
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`
                    cursor-pointer transition-all duration-300 transform perspective-1000 w-full h-full min-h-0
                    ${isFlipped ? 'rotate-y-180 bg-white shadow-md border border-slate-200' : 'bg-primary-500 hover:bg-primary-600 shadow-sm rounded-xl'} 
                    flex items-center justify-center text-3xl sm:text-4xl rounded-xl
                  `}
                >
                  {isFlipped ? card.emoji : ''}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}