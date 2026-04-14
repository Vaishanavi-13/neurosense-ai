import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Brain, 
  Clock, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  Play
} from 'lucide-react';

const mockChartData = [
  { name: 'Mon', score: 65, avg: 60 },
  { name: 'Tue', score: 72, avg: 61 },
  { name: 'Wed', score: 68, avg: 63 },
  { name: 'Thu', score: 81, avg: 65 },
  { name: 'Fri', score: 79, avg: 66 },
  { name: 'Sat', score: 85, avg: 68 },
  { name: 'Sun', score: 88, avg: 69 },
];

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hello, {user?.name || 'User'}!</h2>
          <p className="text-slate-500">Here's your cognitive health summary for today.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/dashboard/games/memory" className="btn-primary flex items-center">
            <Play className="h-4 w-4 mr-2" /> Daily Assessment
          </Link>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-primary-200 transition-colors">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Score</p>
              <h3 className="text-2xl font-bold text-slate-800">88 <span className="text-sm font-normal text-emerald-500 ml-1">↑ 3%</span></h3>
            </div>
          </div>
        </Card>

        <Card className="hover:border-teal-200 transition-colors">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Weekly Progress</p>
              <h3 className="text-2xl font-bold text-slate-800">+12% <span className="text-sm font-normal text-slate-400 ml-1">vs last wk</span></h3>
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
              <h3 className="text-2xl font-bold text-slate-800">2h ago</h3>
              <p className="text-xs text-slate-400 mt-1">Memory Match</p>
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
              <p className="text-xs text-slate-400 mt-1">Based on ML evaluation</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Cognitive Score Trend" subtitle="Your performance over the last 7 days" icon={Activity}>
            <div className="h-72 mt-4">
              <Chart data={mockChartData} type="line" dataKeys={['score', 'avg']} />
            </div>
          </Card>
        </div>

        {/* Recommended Actions */}
        <div className="space-y-6">
          <Card title="Today's Exercises" icon={Brain}>
            <div className="space-y-4 mt-2">
              <Link to="/dashboard/games/memory" className="block p-4 rounded-xl border border-slate-100 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <span className="font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-primary-700">Memory Cards</h4>
                    <p className="text-xs text-slate-500">5 mins • Focus</p>
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
                    <p className="text-xs text-slate-500">3 mins • Reflexes</p>
                  </div>
                </div>
                <Play className="h-4 w-4 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link to="/dashboard/games/recall" className="block p-4 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-between group">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                    <span className="font-bold">W</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-purple-700">Word Recall</h4>
                    <p className="text-xs text-slate-500">4 mins • Memory</p>
                  </div>
                </div>
                <Play className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}