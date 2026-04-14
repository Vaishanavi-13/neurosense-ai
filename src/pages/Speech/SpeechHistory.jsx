import React, { useEffect, useState } from 'react';
import { speechService } from '../../services/speechService';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { ArrowLeft, Clock, Activity, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SpeechHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(speechService.getHistory());
  }, []);

  const hasData = history.length > 0;

  // Prepare chart data format
  const chartData = history.slice(-10).map((item, index) => {
    return {
      name: `T-${history.length - index}`,
      wpm: item.metrics.wpm,
      pauses: item.metrics.pauseCount,
      repetition: parseFloat(item.metrics.repetitionRate) * 100
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <button 
          onClick={() => navigate('/dashboard/speech')}
          className="flex items-center text-slate-500 hover:text-primary-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tasks
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">Vocal Biomarker History</h1>
        <p className="text-slate-600 mt-2">Track the progression of your speech metrics over time.</p>
      </div>

      {!hasData ? (
        <Card className="text-center py-16 px-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No History Available</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't completed any speech tasks yet. Start a task to generate your first baseline assessment.</p>
          <Link to="/dashboard/speech" className="btn-primary">Start First Task</Link>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Words Per Minute Trend" icon={Activity}>
              <div className="h-72 mt-4">
                <Chart data={chartData} type="line" dataKeys={['wpm']} />
              </div>
            </Card>

            <Card title="Speech Interruptions" subtitle="Pauses and Repetitions (%)" icon={Activity}>
              <div className="h-72 mt-4">
                <Chart data={chartData} type="bar" dataKeys={['pauses', 'repetition']} />
              </div>
            </Card>
          </div>

          <Card title="Recent Assessments" icon={FileText}>
             <div className="overflow-x-auto mt-4">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-200">
                     <th className="py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                     <th className="py-3 px-4 text-sm font-semibold text-slate-600">Task Type</th>
                     <th className="py-3 px-4 text-sm font-semibold text-slate-600">Risk Level</th>
                     <th className="py-3 px-4 text-sm font-semibold text-slate-600">Analysis</th>
                   </tr>
                 </thead>
                 <tbody>
                   {history.slice().reverse().map((item) => (
                     <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                       <td className="py-3 px-4 text-sm text-slate-700 whitespace-nowrap">
                         {new Date(item.date).toLocaleDateString()}
                       </td>
                       <td className="py-3 px-4 text-sm text-slate-700 capitalize">
                         {item.taskType.replace('-', ' ')}
                       </td>
                       <td className="py-3 px-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                            item.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-emerald-100 text-emerald-700'
                         }`}>
                           {item.riskLevel}
                         </span>
                       </td>
                       <td className="py-3 px-4">
                         <Link to={`/dashboard/speech/result/${item.id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                           View Details
                         </Link>
                       </td>
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
