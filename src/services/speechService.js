// Mock API for processing speech and returning dementia risk analysis
export const speechService = {
  processAudio: async (audioBlob, taskType) => {
    // Simulate network delay for processing audio
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock results based on task type or randomly
        const riskLevels = ['Low', 'Medium', 'High'];
        const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        
        let mockTranscript = "";
        let highlights = []; // Highlight words with issues (e.g. repetition, pause filler)
        
        if (taskType === 'picture-description') {
          mockTranscript = "Well, uh, there's a woman who is, you know, washing dishes. And the water is spilling over on the floor. And the boy is trying to get a cookie from the jar but the stool is falling over. Em, the girl is just standing there.";
          highlights = [
            { word: "uh", issue: "filler" },
            { word: "you know", issue: "filler" },
            { word: "Em", issue: "filler" }
          ];
        } else if (taskType === 'reading') {
          mockTranscript = "The quick brown fox jumps over the lazy dog. But the the dog just sleeps.";
          highlights = [
            { word: "the the", issue: "repetition" }
          ];
        } else {
          mockTranscript = "I think... I think the answer is probably Tuesday. Wait, no, Wednesday.";
          highlights = [
            { word: "I think... I think", issue: "repetition" },
            { word: "Wait, no", issue: "correction" }
          ];
        }

        const metrics = {
          wpm: Math.floor(Math.random() * 60) + 80, // 80 - 140 WPM
          pauseCount: Math.floor(Math.random() * 10), // 0 - 9 pauses
          repetitionRate: (Math.random() * 0.1).toFixed(2), // 0% - 10%
        };

        const result = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          taskType,
          transcript: mockTranscript,
          highlights,
          metrics,
          riskLevel: randomRisk,
          confidenceScore: (Math.random() * 20 + 70).toFixed(1) + "%", // 70-90%
        };

        // Save to mock local storage
        const history = JSON.parse(localStorage.getItem('speech_history') || '[]');
        history.push(result);
        localStorage.setItem('speech_history', JSON.stringify(history));

        resolve(result);
      }, 3000); // 3 seconds mock delay
    });
  },

  getHistory: () => {
    return JSON.parse(localStorage.getItem('speech_history') || '[]');
  },

  getResultById: (id) => {
    const history = JSON.parse(localStorage.getItem('speech_history') || '[]');
    return history.find(entry => entry.id === id);
  }
};
