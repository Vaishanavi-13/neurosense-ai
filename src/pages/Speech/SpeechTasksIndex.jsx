import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Image as ImageIcon, BookOpen, MessageSquare } from 'lucide-react';
import Card from '../../components/Card';
import { useApp } from '../../hooks/useApp';

export default function SpeechTasksIndex() {
  const { t } = useApp();
  const navigate = useNavigate();

  const tasks = [
    {
      id: 'picture-description',
      title: t.image_recall, 
      description: t.image_recall_desc,
      icon: ImageIcon,
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 'reading',
      title: t.word_recall_test, 
      description: t.word_recall_sub,
      icon: BookOpen,
      color: 'bg-emerald-100 text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'question-answer',
      title: t.question_num + ' ' + t.answer_label, 
      description: t.provide_details,
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 transition-colors">
          <Mic className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{t.speech_assessments}</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          {t.speech_index_desc}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => navigate(`/dashboard/speech/task/${task.id}`)}
            className={`cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-slate-900 rounded-2xl border ${task.borderColor} dark:border-slate-800 p-6 flex flex-col items-center text-center`}
          >
            <div className={`p-4 rounded-full ${task.color} dark:bg-slate-800/80 mb-6 transition-colors`}>
              <task.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{task.title}</h3>
            <p className="text-muted text-sm flex-1 leading-relaxed">{task.description}</p>
            <div className="mt-6 w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {t.start_task}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-900/30 flex flex-col sm:flex-row items-center justify-between shadow-sm transition-colors">
        <div className="mb-4 sm:mb-0">
          <h4 className="text-lg font-bold text-primary-900 dark:text-primary-300 mb-1">{t.view_history_btn}</h4>
          <p className="text-primary-700 dark:text-primary-400 text-sm">{t.history_desc}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/speech/history')}
          className="btn-primary whitespace-nowrap px-6 py-3"
        >
          {t.view_history}
        </button>
      </div>
    </div>
  );
}
