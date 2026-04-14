import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { Link } from 'react-router-dom';
import { gameService } from '../../services/gameService';
import { riskService } from '../../services/riskService';
import { 
  Activity, 
  Brain, 
  Clock, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  Play,
  Gamepad2,
  ShieldAlert
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const hasData = logs.length > 0;

  useEffect(() => {
    setLogs(gameService.getUserLogs());
    setRiskAssessment(riskService.calculateRisk(user));
  }, [user]);

  const getRecentChartData = () => {
    if (!hasData) return [];
    return logs.slice(-7).map((log) => ({
      name: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }),
      score: log.score,
    }));
  };

  const latest = hasData ? logs[logs.length - 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hello, {user?.name || 'User'}!</h2>
          <p className="text-slate-500">Here's your cognitive health summary for today.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/dashboard/games" className="btn-primary flex items-center">
            <Play className="h-4 w-4 mr-2" /> Play Games
          </Link>
        </div>
      </div>

      {!hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
             <div className="h-20 w-20 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
               <Gamepad2 className="h-10 w-10" />
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">No game activity yet</h3>
             <p className="text-slate-500 max-w-sm mb-8 text-lg">
               Start playing cognitive games to see your daily progress charts and generate comprehensive scoring metrics.
             </p>
             <Link to="/dashboard/games" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
               Begin Training
             </Link>
           </div>
           
           <div className="lg:col-span-1">
             <Card title="Initial Clinical Assessment" icon={ShieldAlert} className="h-full">
               <div className="flex flex-col h-full bg-slate-50 rounded-xl p-6 mt-4 border border-slate-100 items-center text-center">
                 <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Baseline Risk Level</h4>
                 <div className={`text-4xl font-extrabold mb-4 
                   ${riskAssessment?.riskLevel === 'Low' ? 'text-emerald-500' : 
                     riskAssessment?.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                   {riskAssessment?.riskLevel || 'Unknown'}
                 </div>
                 <p className="text-sm text-slate-600 flex-1 leading-relaxed">
                   {riskAssessment?.explanation || 'Based on your medical history'}
                 </p>
                 <Link to="/dashboard/risk" className="btn-outline w-full mt-6 text-sm">View Full Details</Link>
               </div>
             </Card>
           </div>
        </div>
      ) : (
        <>
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:border-primary-200 transition-colors">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Latest Score</p>
                  <h3 className="text-2xl font-bold text-slate-800">{latest.score}</h3>
                </div>
              </div>
            </Card>

            <Card className="hover:border-teal-200 transition-colors">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Games</p>
                  <h3 className="text-2xl font-bold text-slate-800">{logs.length}</h3>
                </div>
              </div>
            </Card>

            <Card className="hover:border-purple-200 transition-colors">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Last Activity</p>
                  <h3 className="text-sm font-bold text-slate-800 mt-1 truncate">{latest.gameType}</h3>
                </div>
              </div>
            </Card>

            <Link to="/dashboard/risk" className="block focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl">
              <Card className="hover:border-emerald-200 transition-colors h-full">
                 <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Composite Risk</p>
                    <h3 className={`text-2xl font-bold ${riskAssessment?.riskLevel === 'Low' ? 'text-emerald-600' : riskAssessment?.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {riskAssessment?.riskLevel || 'Unknown'}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 space-y-6">
              <Card title="Activity Score Trend" subtitle="Your recent performance" icon={Activity}>
                <div className="h-72 mt-4">
                  <Chart data={getRecentChartData()} type="line" dataKeys={['score']} />
                </div>
              </Card>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-6">
              <Card title="Continue Training" icon={Brain}>
                <div className="space-y-4 mt-2">
                  <Link to="/dashboard/games/memory" className="block p-4 rounded-xl border border-slate-100 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        <span className="font-bold">M</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 group-hover:text-primary-700">Memory Cards</h4>
                      </div>
                    </div>
                    <Play className="h-4 w-4 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  
                  <Link to="/dashboard/games/image-recall" className="block p-4 rounded-xl border border-slate-100 hover:border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mr-3">
                        <span className="font-bold">I</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 group-hover:text-orange-600">Image Recall</h4>
                      </div>
                    </div>
                    <Play className="h-4 w-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}