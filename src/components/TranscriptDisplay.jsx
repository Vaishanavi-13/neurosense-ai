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
        
        let bgColor = "bg-yellow-100 text-yellow-800"; // Default issue
        if (h.issue === 'filler') bgColor = "bg-orange-100 text-orange-800 border-b border-orange-300";
        if (h.issue === 'repetition') bgColor = "bg-red-100 text-red-800 border-b border-red-300";
        if (h.issue === 'correction') bgColor = "bg-blue-100 text-blue-800 border-b border-blue-300";

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
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Transcribed Text
        </h4>
        <div className="flex space-x-3 text-xs">
           <div className="flex items-center"><div className="w-3 h-3 rounded bg-red-100 border border-red-300 mr-1"></div>Repetition</div>
           <div className="flex items-center"><div className="w-3 h-3 rounded bg-orange-100 border border-orange-300 mr-1"></div>Filler</div>
        </div>
      </div>
      <p className="text-lg text-slate-700 leading-relaxed font-serif">
        {renderHighlightedTranscript()}
      </p>
    </div>
  );
}
