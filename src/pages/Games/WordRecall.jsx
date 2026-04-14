import React, { useState, useEffect } from 'react';
import { Brain, Play, RotateCcw, Check, X } from 'lucide-react';
import { gameService } from '../../services/gameService';

const WORDS = [
  'APPLE', 'TRAIN', 'HOUSE', 'RIVER', 'BREAD', 
  'CLOUD', 'CHAIR', 'SMILE', 'CLOCK', 'BLOOM'
];

export default function WordRecall() {
  const [gameState, setGameState] = useState('idle'); // idle, showing, typing, finished
  const [wordsToShow, setWordsToShow] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [recalledWords, setRecalledWords] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const startGame = () => {
    // Select 5 random words
    const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
    setWordsToShow(shuffled.slice(0, 5));
    setGameState('showing');
    setCurrentWordIndex(0);
    setRecalledWords([]);
    setScore(0);
    setUserInput('');
  };

  useEffect(() => {
    let timer;
    if (gameState === 'showing') {
      timer = setTimeout(() => {
        if (currentWordIndex < wordsToShow.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          setGameState('typing');
          setStartTime(Date.now());
        }
      }, 2000); // Show each word for 2 seconds
    }
    return () => clearTimeout(timer);
  }, [gameState, currentWordIndex, wordsToShow.length]);

  const handleSubmitWord = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const word = userInput.trim().toUpperCase();
    if (!recalledWords.includes(word)) {
      setRecalledWords(prev => [...prev, word]);
    }
    setUserInput('');
    
    // Check if finished (user submitted 5 words or clicked finish)
    if (recalledWords.length === 4) { // this is the 5th word
      finishGame([...recalledWords, word]);
    }
  };

  const finishGame = (finalWords = recalledWords) => {
    setGameState('finished');
    let correct = 0;
    finalWords.forEach(w => {
      if (wordsToShow.includes(w)) correct++;
    });
    setScore(correct);
    
    // Save metric
    const timeTaken = Date.now() - startTime;
    gameService.saveGameSession('Word Recall', correct * 20, timeTaken);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div>
          <h2 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
            <Brain className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" /> Word Recall Test
          </h2>
          <p className="text-sm text-muted">Memorize the words and recall them.</p>
        </div>
        <button 
          onClick={startGame} 
          className="btn-primary flex items-center mt-4 sm:mt-0 px-6"
          disabled={gameState === 'showing'}
        >
          {gameState === 'idle' ? <Play className="h-4 w-4 mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
          {gameState === 'idle' ? 'Start Test' : 'Restart'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-96 flex flex-col transition-colors">
        {gameState === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/50">
            <Brain className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Short-term Memory Assessment</h3>
            <p className="text-muted mt-2 max-w-md">
              You will be shown 5 words, one at a time. Pay close attention. After all words have been shown, you will be asked to type back down as many as you can remember.
            </p>
          </div>
        )}

        {gameState === 'showing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-purple-50 dark:bg-purple-900/20 transition-colors">
            <p className="text-purple-500 dark:text-purple-400 font-medium tracking-widest mb-8 uppercase text-sm">Memorize this word</p>
            <h1 className="text-5xl md:text-7xl font-bold text-purple-900 dark:text-purple-300 tracking-wider">
              {wordsToShow[currentWordIndex]}
            </h1>
            <div className="mt-12 flex space-x-2">
              {wordsToShow.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full transition-all duration-300 ${i === currentWordIndex ? 'bg-purple-600 dark:bg-purple-500 w-12' : 'bg-purple-200 dark:bg-purple-900'}`} />
              ))}
            </div>
          </div>
        )}

        {gameState === 'typing' && (
          <div className="flex-1 flex flex-col p-8 bg-white dark:bg-slate-900 animate-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Recall the words</h3>
            <p className="text-muted mb-6">Type the words you remember and press Enter. Order does not matter.</p>
            
            <form onSubmit={handleSubmitWord} className="flex gap-4 mb-8">
              <input 
                type="text" 
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:border-purple-500 outline-none text-lg uppercase text-slate-800 dark:text-white transition-all"
                placeholder="TYPE A WORD HERE"
                autoFocus
              />
              <button type="submit" className="btn-primary px-8">Submit</button>
            </form>

            <div className="flex flex-wrap gap-3">
              {recalledWords.map((word, i) => (
                <div key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-medium text-slate-700 dark:text-slate-200 tracking-wide border border-slate-200 dark:border-slate-700 animate-in zoom-in-75">
                  {word}
                </div>
              ))}
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <span className="text-muted">{recalledWords.length} / 5 words entered</span>
               <button onClick={() => finishGame()} className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">I can't remember anymore</button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 animate-in zoom-in-95 duration-300">
            <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 border-4 border-purple-100 dark:border-purple-900/30 flex items-center justify-center mb-6 shadow-sm">
              <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">{score}<span className="text-xl text-purple-400/60 dark:text-purple-500/40">/5</span></span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Assessment Complete!</h3>
            
            <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700 mb-8 transition-colors">
              {wordsToShow.map((word, i) => {
                const found = recalledWords.includes(word);
                return (
                  <div key={i} className="px-6 py-4 flex justify-between items-center">
                    <span className={`font-medium ${found ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>{word}</span>
                    {found ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-red-400" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}