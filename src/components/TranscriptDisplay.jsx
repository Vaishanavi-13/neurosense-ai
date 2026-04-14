import React from 'react';

export default function TranscriptDisplay({ transcript, highlights }) {
  if (!transcript) return <p className="text-slate-500 italic">No transcript available.</p>;

  // Function to stylize highlighted words
  const renderHighlightedTranscript = () => {
    if (!highlights || highlights.length === 0) return <span>{transcript}</span>;

    let elements = [];
    let remainingText = transcript;

    // A very rudimentary highlight matching. Note: realistically this requires complex string alignment
    // But for mock display purposes, we'll just string replace and split.
    highlights.forEach((h, index) => {
      const parts = remainingText.split(h.word);
      if (parts.length > 1) {
        elements.push(<span key={`part-${index}`}>{parts[0]}</span>);
        
        let bgColor = "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30";
        if (h.issue === 'filler') bgColor = "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30";
        if (h.issue === 'repetition') bgColor = "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/30";
        if (h.issue === 'correction') bgColor = "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30";

        elements.push(
          <span 
            key={`highlight-${index}`} 
            className={`px-1 py-0.5 rounded cursor-help transition-colors ${bgColor}`}
            title={`Detected issue: ${h.issue}`}
          >
            {h.word}
          </span>
        );
        remainingText = parts.slice(1).join(h.word);
      }
    });
    
    // Add leftover text
    if (remainingText) elements.push(<span key="leftover">{remainingText}</span>);

    return elements;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Transcribed Text
        </h4>
        <div className="flex space-x-3 text-xs text-muted transition-colors">
           <div className="flex items-center"><div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 mr-1 transiton-colors"></div>Repetition</div>
           <div className="flex items-center"><div className="w-3 h-3 rounded bg-orange-100 dark:bg-orange-900/40 border border-orange-300 dark:border-orange-800 mr-1 transiton-colors"></div>Filler</div>
        </div>
      </div>
      <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-serif transition-colors">
        {renderHighlightedTranscript()}
      </p>
    </div>
  );
}
