import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Image as ImageIcon, BookOpen, MessageSquare } from 'lucide-react';
import Card from '../../components/Card';

export default function SpeechTasksIndex() {
  const navigate = useNavigate();

  const tasks = [
    {
      id: 'picture-description',
      title: 'Picture Description',
      description: 'Describe what you see in the provided image in as much detail as possible.',
      icon: ImageIcon,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'reading',
      title: 'Reading Task',
      description: 'Read the provided paragraph aloud clearly and naturally.',
      icon: BookOpen,
      color: 'bg-emerald-100 text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'question-answer',
      title: 'Question Answer',
      description: 'Listen to or read the prompt and respond with your best answer.',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
          <Mic className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Speech Analysis Assessments</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select a task below to begin capturing your voice. These exercises map vocal patterns to cognitive health indicators.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => navigate(`/dashboard/speech/task/${task.id}`)}
            className={`cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl bg-white rounded-2xl border ${task.borderColor} p-6 flex flex-col items-center text-center`}
          >
            <div className={`p-4 rounded-full ${task.color} mb-6`}>
              <task.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{task.title}</h3>
            <p className="text-slate-600 text-sm flex-1 leading-relaxed">{task.description}</p>
            <div className="mt-6 w-full py-3 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors">
              Start Task
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex flex-col sm:flex-row items-center justify-between shadow-sm">
        <div className="mb-4 sm:mb-0">
          <h4 className="text-lg font-bold text-primary-900 mb-1">View Assessment History</h4>
          <p className="text-primary-700 text-sm">Review your past results and track your cognitive speech metrics over time.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/speech/history')}
          className="btn-primary whitespace-nowrap px-6 py-3"
        >
          View History
        </button>
      </div>
    </div>
  );
}
