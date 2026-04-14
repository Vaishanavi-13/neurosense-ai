import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { Link } from 'react-router-dom';
import { gameService } from '../../services/gameService';
import { 
  Activity, 
  Brain, 
  Clock, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  Play,
  Gamepad2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const hasData = logs.length > 0;

  useEffect(() => {
    setLogs(gameService.getUserLogs());
  }, []);

  const getRecentChartData = () => {
    if (!hasData) return [];
    // Super basic mock aggregation just to show something when there is >0 data
    return logs.slice(-7).map((log, i) => ({
      name: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }),
      score: log.score,
      avg: Math.max(log.score - 5, 0)
    }));
  };

  const getLatestActivity = () => {
    if (!hasData) return null;
    return logs[logs.length - 1];
  };

  const latest = getLatestActivity();

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
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
            <Gamepad2 className="h-12 w-12" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No activity yet.</h3>
          <p className="text-slate-500 max-w-sm mb-8 text-lg">
            Start playing cognitive games to see your daily progress, stats, and risk assessment models right here!
          </p>
          <Link to="/dashboard/games" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
            Start Game
          </Link>
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

            <Card className="hover:border-emerald-200 transition-colors">
               <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Risk Level</p>
                  <h3 className="text-2xl font-bold text-emerald-600">Low</h3>
                  <p className="text-xs text-slate-400 mt-1">Sufficient baseline</p>
                </div>
              </div>
            </Card>
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
                  
                  <Link to="/dashboard/games/reaction" className="block p-4 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50 transition-all flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mr-3">
                        <span className="font-bold">R</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 group-hover:text-teal-700">Reaction Time</h4>
                      </div>
                    </div>
                    <Play className="h-4 w-4 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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