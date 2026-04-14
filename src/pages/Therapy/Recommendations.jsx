import React from 'react';
import Card from '../../components/Card';
import { HeartHandshake, CheckSquare, Clock, Lightbulb, BellRing } from 'lucide-react';

const mockTherapy = [
  { id: 1, type: 'Exercise', title: 'Aerobic Walk', duration: '30 mins', freq: 'Daily', done: true },
  { id: 2, type: 'Cognitive', title: 'Sudoku / Crossword', duration: '15 mins', freq: 'Daily', done: false },
  { id: 3, type: 'Social', title: 'Call a friend/family', duration: '20 mins', freq: '3x / week', done: false },
  { id: 4, type: 'Diet', title: 'Mediterranean Meal', duration: '-', freq: 'Daily', done: true },
];

export default function Recommendations() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <HeartHandshake className="mr-2 h-6 w-6 text-primary-600" /> Therapy & Recommendations
        </h2>
        <p className="text-slate-500">Personalized activities tailored to improve your cognitive resilience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card title="Today's Action Plan" icon={CheckSquare}>
            <div className="mt-4 space-y-3">
              {mockTherapy.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white transition-colors group">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                      defaultChecked={task.done} 
                    />
                    <div className="ml-4">
                      <h4 className={`font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500">{task.type} • {task.duration}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-1 rounded-md">{task.freq}</span>
                </div>
              ))}
            </div>
          </Card>
          
          <Card title="Cognitive Tips" icon={Lightbulb}>
             <div className="mt-4 space-y-4">
               <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                 <h4 className="font-semibold text-amber-900">Sleep Hygiene</h4>
                 <p className="text-sm text-amber-800 mt-1">Aim for 7-8 hours of uninterrupted sleep. Quality sleep is crucial for memory consolidation and clearing brain toxins.</p>
               </div>
               <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                 <h4 className="font-semibold text-emerald-900">Stay Hydrated</h4>
                 <p className="text-sm text-emerald-800 mt-1">Even mild dehydration can affect concentration and memory. Drink at least 8 glasses of water daily.</p>
               </div>
             </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Reminders" icon={BellRing}>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">Medication Dose</p>
                  <p className="text-xs text-slate-500">2:00 PM • After lunch</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mr-3 mt-0.5">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">Doctor's Appointment</p>
                  <p className="text-xs text-slate-500">Tomorrow • Dr. Smith</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}