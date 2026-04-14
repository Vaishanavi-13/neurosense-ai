import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { Gamepad2, Play, RotateCcw } from 'lucide-react';
import { gameService } from '../../services/gameService';

const INITIAL_CARDS = ['🧠', '🧬', '💊', '🩺', '🔬', '🏥', '🚑', '👨‍⚕️'];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [won, setWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  
  const generateCards = () => {
    const duplicated = [...INITIAL_CARDS, ...INITIAL_CARDS];
    return duplicated.sort(() => Math.random() - 0.5).map((emoji, index) => ({ id: index, emoji }));
  };

  const startGame = () => {
    setCards(generateCards());
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
    if (solved.length === INITIAL_CARDS.length * 2 && solved.length > 0 && !won) {
      setWon(true);
      setIsPlaying(false);
      
      const timeTakenMs = Date.now() - startTime;
      const finalScore = Math.max(100 - (moves * 2), 10); // Simple scoring algorithm
      gameService.saveGameSession('Memory Match', finalScore, timeTakenMs);
    }
  }, [solved, won, moves, startTime]);

  const handleCardClick = (index) => {
    if (!isPlaying || flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
    setFlipped(prev => [...prev, index]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold flex items-center text-slate-800">
            <Gamepad2 className="mr-2 h-6 w-6 text-primary-600" /> Memory Match
          </h2>
          <p className="text-sm text-slate-500">Find all the matching pairs</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">MOVES</p>
            <p className="text-2xl font-bold text-slate-800">{moves}</p>
          </div>
          <button 
            onClick={startGame} 
            className="btn-primary flex items-center"
          >
            {isPlaying || moves > 0 ? <RotateCcw className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying || moves > 0 ? 'Restart' : 'Start Game'}
          </button>
        </div>
      </div>

      {!isPlaying && !won && (
         <div className="h-96 flex flex-col items-center justify-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
            <Gamepad2 className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Ready to test your memory?</h3>
            <p className="text-slate-500 mt-2 mb-6 text-center max-w-sm">
              Click the start button to begin. Try to match all pairs with the fewest moves possible.
            </p>
            <button onClick={startGame} className="btn-primary px-8">Start Assessment</button>
         </div>
      )}

      {won && (
         <div className="h-96 flex flex-col items-center justify-center bg-emerald-50 rounded-2xl border-2 border-emerald-200">
            <h3 className="text-3xl font-bold text-emerald-700 mb-2">Excellent Work!</h3>
            <p className="text-emerald-600 text-lg">You completed the assessment in {moves} moves.</p>
            <p className="text-emerald-500 text-sm mt-1 mb-8">Score has been automatically saved to your profile.</p>
            <button onClick={startGame} className="btn-primary px-8">Play Again</button>
         </div>
      )}

      {isPlaying && (
        <div className="grid grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || solved.includes(index);
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform perspective-1000 ${isFlipped ? 'rotate-y-180 bg-white shadow-md border border-slate-200' : 'bg-primary-500 hover:bg-primary-600 shadow-sm'} flex items-center justify-center text-4xl`}
              >
                {isFlipped ? card.emoji : ''}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}