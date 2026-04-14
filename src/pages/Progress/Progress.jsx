import React, { useState } from 'react';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { Calendar, TrendingUp, Clock, FileText } from 'lucide-react';

const yearlyData = [
  { name: 'Jan', score: 60, reaction: 800 },
  { name: 'Feb', score: 62, reaction: 780 },
  { name: 'Mar', score: 65, reaction: 750 },
  { name: 'Apr', score: 63, reaction: 760 },
  { name: 'May', score: 68, reaction: 740 },
  { name: 'Jun', score: 72, reaction: 710 },
  { name: 'Jul', score: 75, reaction: 690 },
  { name: 'Aug', score: 78, reaction: 680 },
];

const mockLogs = [
  { id: 1, date: '2026-04-14', game: 'Memory Match', score: 85, time: '3m 12s', status: 'Excellent' },
  { id: 2, date: '2026-04-13', game: 'Word Recall', score: 78, time: '4m 05s', status: 'Good' },
  { id: 3, date: '2026-04-12', game: 'Reaction Time', score: 92, time: '1m 45s', status: 'Excellent' },
  { id: 4, date: '2026-04-10', game: 'Memory Match', score: 80, time: '3m 30s', status: 'Good' },
  { id: 5, date: '2026-04-08', game: 'Word Recall', score: 74, time: '4m 20s', status: 'Average' },
];

export default function Progress() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary-600" /> My Progress
          </h2>
          <p className="text-slate-500">Track your cognitive improvements over time.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${timeRange === '1m' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setTimeRange('1m')}
          >
            1M
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${timeRange === '6m' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setTimeRange('6m')}
          >
            6M
          </button>
          <button 
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${timeRange === '1y' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setTimeRange('1y')}
          >
            1Y
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Overall Cognitive Score" subtitle="Higher is better" icon={AwardIcon}>
          <div className="h-72 mt-4">
             <Chart data={yearlyData} type="line" dataKeys={['score']} colors={['#0ea5e9']} />
          </div>
        </Card>
        
        <Card title="Reaction Time (ms)" subtitle="Lower is better" icon={Clock}>
          <div className="h-72 mt-4">
             <Chart data={yearlyData} type="line" dataKeys={['reaction']} colors={['#14b8a6']} />
          </div>
        </Card>
      </div>

      <Card title="Activity Log" icon={FileText} className="overflow-hidden">
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-medium text-slate-500 uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Exercise</th>
                <th className="p-4 text-center">Score</th>
                <th className="p-4 text-center">Duration</th>
                <th className="p-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {log.date}
                  </td>
                  <td className="p-4 font-medium text-slate-800">{log.game}</td>
                  <td className="p-4 text-center font-semibold text-slate-700">{log.score} / 100</td>
                  <td className="p-4 text-center text-slate-500">{log.time}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${log.status === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        log.status === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Inline Icon to keep imports simple
function AwardIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  )
}