import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { ShieldAlert, Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { riskService } from '../../services/riskService';
import { useAuth } from '../../hooks/useAuth';

export default function RiskAssessment() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    setAssessment(riskService.calculateRisk(user));
  }, [user]);

  if (!assessment) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <ShieldAlert className="mr-2 h-6 w-6 text-primary-600" /> 
          {assessment.isComposite ? 'Composite Risk Assessment' : 'Clinical Risk Baseline'}
        </h2>
        <p className="text-slate-500">
          {assessment.isComposite 
            ? 'AI-driven analysis combining your medical profile with longitudinal game performance.' 
            : 'Preliminary risk evaluation computed strictly from your registered medical history.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`col-span-1 border-t-4 ${assessment.riskLevel === 'Low' ? 'border-t-emerald-500' : assessment.riskLevel === 'Medium' ? 'border-t-yellow-500' : 'border-t-red-500'}`}>
          <div className="text-center py-6">
            <div className={`inline-flex h-20 w-20 rounded-full items-center justify-center mb-4 
              ${assessment.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-500' : assessment.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-500' : 'bg-red-50 text-red-500'}`}>
              {assessment.riskLevel === 'Low' && <CheckCircle className="h-10 w-10" />}
              {assessment.riskLevel !== 'Low' && <AlertTriangle className="h-10 w-10" />}
            </div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Overall Risk Level</h3>
            <p className={`text-4xl font-extrabold mt-2 
              ${assessment.riskLevel === 'Low' ? 'text-emerald-600' : assessment.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
              {assessment.riskLevel}
            </p>
            <p className="text-sm text-slate-500 mt-4 px-2">
              {assessment.explanation}
            </p>
          </div>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Assessment Details</h3>
          <div className="space-y-4">
            {assessment.details.map((detail, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start">
                 <div className={`mt-0.5 h-2 w-2 rounded-full mr-3 ${detail.impact === 'High' ? 'bg-red-500' : detail.impact === 'Moderate' ? 'bg-yellow-500' : detail.impact === 'Positive' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">{detail.label}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${detail.impact === 'High' ? 'text-red-600' : detail.impact === 'Moderate' ? 'text-yellow-600' : detail.impact === 'Positive' ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {detail.impact}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{detail.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {!assessment.isComposite && (
         <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-xl p-4 flex items-center shadow-sm">
           <AlertTriangle className="h-6 w-6 mr-3 text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-bold">Missing Activity Data</p>
              <p className="text-sm mt-0.5">Your risk profile is currently evaluated strictly on your initial questionnaire. Please complete cognitive games to generate a comprehensive predictive assessment.</p>
            </div>
         </div>
      )}

      {assessment.suggestions.length > 0 && (
         <Card title="Recommendations" icon={Lightbulb}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {assessment.suggestions.map((sug, idx) => (
                   <div key={idx} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900">{sug.title}</h4>
                      <p className="text-sm text-blue-800 mt-1">{sug.desc}</p>
                   </div>
                ))}
             </div>
         </Card>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-start">
        <Info className="h-6 w-6 text-slate-500 mr-4 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-slate-700 mb-1">How this works</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            NeuroSense-AI generates a proprietary score by blending heavily weighted clinical history inputs (comorbidities, subjective symptoms, age ranges) with live cognitive performance analytics (reaction time stability, recall accuracy limits).
            <strong> This is an informational baseline, not a medical diagnosis.</strong> Always consult with a healthcare professional regarding any cognitive concerns.
          </p>
        </div>
      </div>
    </div>
  );
}