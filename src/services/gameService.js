import { getFromStorage, saveToStorage } from './api';
import { authService } from './authService';

const GAMES_KEY = 'neurosense_games';

export const gameService = {
  saveGameSession(gameType, score, timeTaken) {
    const user = authService.getCurrentUser();
    if (!user) return;
    
    const logs = getFromStorage(GAMES_KEY, []) || [];
    const newLog = {
      id: Date.now().toString(),
      userId: user.id,
      gameType,
      score,
      timeTaken,
      date: new Date().toISOString()
    };
    
    logs.push(newLog);
    saveToStorage(GAMES_KEY, logs);
    return newLog;
  },

  getUserLogs() {
    const user = authService.getCurrentUser();
    if (!user) return [];
    
    const logs = getFromStorage(GAMES_KEY, []) || [];
    return logs.filter(log => log.userId === user.id);
  },

  hasPlayedGames() {
    return this.getUserLogs().length > 0;
  }
};
