import React from 'react';
import Card from '../../components/Card';
import { ShieldAlert, Info, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

export default function RiskAssessment() {
  const riskLevel = 'Low'; // Hardcoded for prototype. 'Low' | 'Medium' | 'High'
  const confidence = 89;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <ShieldAlert className="mr-2 h-6 w-6 text-primary-600" /> ML Risk Assessment
        </h2>
        <p className="text-slate-500">AI-driven analysis of your cognitive patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`col-span-1 border-t-4 ${riskLevel === 'Low' ? 'border-t-emerald-500' : riskLevel === 'Medium' ? 'border-t-yellow-500' : 'border-t-red-500'}`}>
          <div className="text-center py-6">
            <div className={`inline-flex h-20 w-20 rounded-full items-center justify-center mb-4 
              ${riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-500' : riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-500' : 'bg-red-50 text-red-500'}`}>
              {riskLevel === 'Low' && <CheckCircle className="h-10 w-10" />}
              {riskLevel !== 'Low' && <AlertTriangle className="h-10 w-10" />}
            </div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Current Risk Level</h3>
            <p className={`text-4xl font-extrabold mt-2 
              ${riskLevel === 'Low' ? 'text-emerald-600' : riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
              {riskLevel}
            </p>
            <p className="text-sm text-slate-400 mt-4 border-t border-slate-100 pt-4">Model Confidence: {confidence}%</p>
          </div>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Assessment Details</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">Memory Retention</span>
                <span className="text-emerald-600 font-bold">Stable</span>
              </div>
              <p className="text-sm text-slate-500">Your recent Memory Match scores show consistent performance with no significant deviations from your baseline.</p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">Reaction Time</span>
                <span className="text-blue-600 font-bold">Improving</span>
              </div>
              <p className="text-sm text-slate-500">Response latencies in visual tasks have decreased by 4% over the last 30 days.</p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-700">Vocabulary Access</span>
                <span className="text-yellow-600 font-bold">Watch</span>
              </div>
              <p className="text-sm text-slate-500">Slight delay observed in Word Recall tasks compared to peer age-group averages. Recommended daily exercise.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start">
        <Info className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">How this works</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            NeuroSense-AI uses an ensemble machine learning model trained on longitudinal cognitive data. It evaluates your interaction speed, error rates, and task completion times against normative datasets to estimate cognitive decline risk. <strong>This is not a medical diagnosis.</strong> Always consult with a healthcare professional regarding any concerns.
          </p>
        </div>
      </div>
    </div>
  );
}