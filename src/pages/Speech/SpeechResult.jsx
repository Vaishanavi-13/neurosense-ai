import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { speechService } from '../../services/speechService';
import { useApp } from '../../hooks/useApp';
import Card from '../../components/Card';
import TranscriptDisplay from '../../components/TranscriptDisplay';
import { 
  ArrowLeft, ShieldAlert, Activity, 
  PauseCircle, RefreshCcw, TrendingUp, CheckCircle, AlertTriangle 
} from 'lucide-react';

export default function SpeechResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { t } = useApp();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = speechService.getResultById(resultId);
    if (data) {
      setResult(data);
    } else {
      // If no result found, maybe redirect or show error
      navigate('/dashboard/speech');
    }
  }, [resultId, navigate]);

  if (!result) return <div className="p-8 text-center text-slate-500">Loading analysis...</div>;

  const isHighRisk = result.riskLevel === 'High';
  const isMediumRisk = result.riskLevel === 'Medium';
  const riskColor = isHighRisk ? 'text-red-600 dark:text-red-400' : isMediumRisk ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400';
  const riskBg = isHighRisk ? 'bg-red-50 dark:bg-red-900/20' : isMediumRisk ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20';
  const RiskIcon = isHighRisk ? AlertTriangle : isMediumRisk ? ShieldAlert : CheckCircle;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <button 
          onClick={() => navigate('/dashboard/speech')}
          className="flex items-center text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {t.back_to_tasks}
        </button>
        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
          {t.result_id}: {result.id.slice(0, 8)} | {t.date}: {new Date(result.date).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Assessment Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className={`text-center border-t-4 transition-colors ${isHighRisk ? 'border-t-red-500' : isMediumRisk ? 'border-t-yellow-500' : 'border-t-emerald-500'}`}>
             <div className={`mx-auto w-16 h-16 rounded-full transition-colors ${riskBg} ${riskColor} flex items-center justify-center mb-4`}>
               <RiskIcon className="h-8 w-8" />
             </div>
             <p className="text-sm font-semibold text-muted uppercase tracking-widest mb-1">{t.detected_risk}</p>
             <h2 className={`text-4xl font-extrabold mb-4 transition-colors ${riskColor}`}>
               {result.riskLevel === 'Low' ? t.low : result.riskLevel === 'Medium' ? t.medium : t.high}
             </h2>
             <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2 transition-colors">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ${isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-yellow-500' : 'bg-emerald-500'}`} 
                  style={{ width: result.confidenceScore }}
                ></div>
             </div>
             <p className="text-xs text-muted font-medium">{t.model_confidence}: {result.confidenceScore}</p>
          </Card>
          
          <Card title={t.ai_recommendations}>
             <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-3 mt-4 transition-colors">
                {isHighRisk && (
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    Recommend consultation with a cognitive specialist.
                  </li>
                )}
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 mr-2 flex-shrink-0"></span>
                  Continue daily reading exercises.
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 mr-2 flex-shrink-0"></span>
                  {t.review_performance_weekly || "Review performance trends weekly."}
                </li>
             </ul>
             <Link to="/dashboard/therapy" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-semibold mt-6 inline-block transition-colors">
                {t.view_full_therapy} &rarr;
              </Link>
          </Card>
        </div>

        {/* Metrics & Transcript */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center p-4">
              <Activity className="h-6 w-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-xs text-muted uppercase font-semibold">{t.speech_rate}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{result.metrics.wpm}</p>
              <p className="text-xs text-slate-400 dark:text-slate-600">{t.words_per_min}</p>
            </Card>
            <Card className="text-center p-4">
              <PauseCircle className="h-6 w-6 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
              <p className="text-xs text-muted uppercase font-semibold">{t.long_pauses}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{result.metrics.pauseCount}</p>
              <p className="text-xs text-slate-400 dark:text-slate-600">{t.counts_gt_2s}</p>
            </Card>
            <Card className="text-center p-4">
              <RefreshCcw className="h-6 w-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-muted uppercase font-semibold">{t.repetition_rate}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{(parseFloat(result.metrics.repetitionRate)*100).toFixed(0)}%</p>
              <p className="text-xs text-slate-400 dark:text-slate-600">{t.repeated_words}</p>
            </Card>
          </div>

          <Card title={t.speech_analysis_details} className="h-full">
            <div className="mt-4">
              <TranscriptDisplay transcript={result.transcript} highlights={result.highlights} />
            </div>
            <div className="mt-8 flex justify-end">
              <Link to="/dashboard/speech" className="btn-primary">
                {t.complete_another}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
