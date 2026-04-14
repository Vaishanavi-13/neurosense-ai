import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { Calendar, TrendingUp, Clock, FileText, Database } from 'lucide-react';
import { gameService } from '../../services/gameService';

export default function Progress() {
  const [logs, setLogs] = useState([]);
  const hasData = logs.length > 0;

  useEffect(() => {
    setLogs(gameService.getUserLogs());
  }, []);

  const getChartData = () => {
    return logs.map((log) => ({
      name: new Date(log.date).toLocaleDateString(),
      score: log.score,
      time: log.timeTaken,
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center transition-colors">
            <TrendingUp className="mr-2 h-6 w-6 text-primary-600 dark:text-primary-400" /> My Progress
          </h2>
          <p className="text-muted">Track your cognitive improvements over time.</p>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-12 text-center flex flex-col items-center transition-colors">
          <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-6 transition-colors">
            <Database className="h-12 w-12" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">No progress data available yet</h3>
          <p className="text-muted max-w-sm mb-8 text-lg">
            Complete your first cognitive game to start generating progress charts and tracking your daily activity.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Cognitive Scores" subtitle="All recent game scores" icon={TrendingUp}>
              <div className="h-72 mt-4">
                 <Chart data={getChartData()} type="line" dataKeys={['score']} colors={['#0ea5e9']} />
              </div>
            </Card>
            
            <Card title="Time Taken (ms)" subtitle="Processing speed across games" icon={Clock}>
              <div className="h-72 mt-4">
                 <Chart data={getChartData()} type="line" dataKeys={['time']} colors={['#14b8a6']} />
              </div>
            </Card>
          </div>

          <Card title="Activity Log" icon={FileText} className="overflow-hidden">
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-slate-200 dark:border-slate-800 text-sm font-medium text-muted uppercase tracking-wider transition-colors">
                    <th className="p-4">Date</th>
                    <th className="p-4">Exercise</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
                  {logs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-slate-600 dark:text-slate-400 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400 dark:text-slate-500" />
                        {new Date(log.date).toLocaleString()}
                      </td>
                      <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{log.gameType}</td>
                      <td className="p-4 text-center font-semibold text-slate-700 dark:text-slate-300">{log.score}</td>
                      <td className="p-4 text-center text-muted">{log.timeTaken}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}