import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import VoiceRecorder from '../../components/VoiceRecorder';
import Card from '../../components/Card';
import { speechService } from '../../services/speechService';

const qaQuestions = [
  "What did you do yesterday?",
  "Describe your daily routine.",
  "Tell me about your family.",
  "What is your favorite food?"
];

// Content for non-QA tasks
const getTaskContent = (taskId) => {
  switch (taskId) {
    case 'picture-description':
      return {
        title: 'Picture Description',
        instructions: 'Please look at the image below and describe everything you see happening. Try to speak for at least 30 seconds.',
        media: (
          <div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700 transition-colors">
             <div className="text-center text-slate-500 dark:text-slate-400">
               <span className="block text-4xl mb-2">🖼️</span>
               <p className="font-medium">Cookie Theft Picture</p>
               <p className="text-xs mt-1">(Standard cognitive assessment image)</p>
             </div>
          </div>
        )
      };
    case 'reading':
      return {
        title: 'Reading Task',
        instructions: 'Please read the following passage aloud in your normal speaking voice.',
        media: (
          <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl transition-colors">
             <p className="text-xl font-serif text-slate-800 dark:text-slate-200 leading-relaxed italic">
               "The sun was shining brightly as the children ran out to play. 
                They took their favorite ball and hurried across the green grass. 
                Suddenly, a small dog appeared from behind the bushes, wagging its tail eagerly."
             </p>
          </div>
        )
      };
    default:
      return { title: 'Unknown Task', instructions: 'Task not found.', media: null };
  }
};

export default function ActiveSpeechTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // Basic task state
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // QA specific state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [qaResponses, setQaResponses] = useState({}); // { 0: blob, 1: blob ... }

  const handleRecordingComplete = (blob) => {
    if (taskId === 'question-answer') {
      if (blob) {
        setQaResponses((prev) => ({ ...prev, [currentQIndex]: blob }));
      } else {
        const newRes = { ...qaResponses };
        delete newRes[currentQIndex];
        setQaResponses(newRes);
      }
    } else {
      setAudioBlob(blob);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    let submitBlob;
    if (taskId === 'question-answer') {
      // In a real scenario, you'd send an array of blobs or a zip. 
      // For mock purposes, we just submit the first blob.
      submitBlob = qaResponses[0] || new Blob();
    } else {
      submitBlob = audioBlob;
    }

    if (!submitBlob) { 
      setIsProcessing(false); 
      return; 
    }

    const result = await speechService.processAudio(submitBlob, taskId);
    
    setIsProcessing(false);
    navigate(`/dashboard/speech/result/${result.id}`);
  };

  // ----------------------------------------------------
  // QUESTION-ANSWER TASK FLOW
  // ----------------------------------------------------
  if (taskId === 'question-answer') {
    const isCompleted = currentQIndex >= qaQuestions.length;
    const currentQ = qaQuestions[currentQIndex];

    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => navigate('/dashboard/speech')}
          className="flex items-center text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tasks
        </button>

        <Card className="mb-8 border-t-4 border-t-primary-500">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Question Answer</h2>
          <p className="text-lg text-muted mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 transition-colors">
            Listen to or read the questions sequentially. Record your answer for each.
          </p>

          {isCompleted ? (
            <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 transition-colors">Task Completed!</h3>
              <p className="text-muted mb-8 max-w-sm mx-auto">
                You have successfully recorded answers for all {qaQuestions.length} questions. You're ready to submit.
              </p>
              <button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className="btn-primary flex items-center justify-center text-lg px-10 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all mx-auto w-full sm:w-auto"
              >
                {isProcessing ? 'Analyzing...' : 'Submit All Responses'}
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300 relative">
              <div className="mb-4 flex items-center justify-between font-semibold text-muted uppercase tracking-widest text-xs transition-colors">
                <span>Question {currentQIndex + 1} of {qaQuestions.length}</span>
                <div className="flex space-x-1">
                  {qaQuestions.map((_, i) => (
                    <div key={i} className={`h-2 w-8 rounded-full transition-all duration-300 ${i <= currentQIndex ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  ))}
                </div>
              </div>
              
              <div className="p-8 md:p-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl text-center mb-8 shadow-sm transition-colors">
                 <p className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4 leading-tight">
                   "{currentQ}"
                 </p>
                 <p className="text-blue-700 dark:text-blue-400">Please provide as many details as possible.</p>
              </div>

              {/* Recorder */}
              <div key={`recorder-${currentQIndex}`} className="bg-slate-50 dark:bg-slate-800/20 rounded-2xl p-2 mb-8 transition-colors">
                 <VoiceRecorder 
                   onRecordingComplete={handleRecordingComplete} 
                   isProcessing={isProcessing} 
                   initialAudioBlob={qaResponses[currentQIndex]}
                 />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6 transition-colors">
                <button 
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="flex items-center px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30 font-medium transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" /> Previous
                </button>

                <button 
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  disabled={!qaResponses[currentQIndex]}
                  className="flex items-center px-8 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-xl disabled:opacity-50 font-bold transition-all shadow-sm"
                >
                  {currentQIndex === qaQuestions.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // BASIC TASKS FLOW (Picture Description, Reading)
  // ----------------------------------------------------
  const content = getTaskContent(taskId);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate('/dashboard/speech')}
        className="flex items-center text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tasks
      </button>

      <Card className="mb-8 border-t-4 border-t-primary-500">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">{content.title}</h2>
        <p className="text-lg text-muted mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 transition-colors">
          {content.instructions}
        </p>

        <div className="mb-8 overflow-hidden rounded-xl">
          {content.media}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/20 rounded-2xl p-2 transition-colors">
           <VoiceRecorder 
             onRecordingComplete={handleRecordingComplete} 
             isProcessing={isProcessing} 
           />
        </div>

        {audioBlob && !isProcessing && (
          <div className="mt-8 flex justify-center animate-in fade-in transition-all">
             <button 
               onClick={handleSubmit}
               className="btn-primary text-lg px-10 py-4 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
             >
               <CheckCircle className="h-6 w-6 mr-3" />
               Submit Recording for Analysis
             </button>
          </div>
        )}
      </Card>
    </div>
  );
}
