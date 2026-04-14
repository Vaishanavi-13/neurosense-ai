import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BrainCircuit, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Step 1 State: PII
  const [pii, setPii] = useState({ name: '', email: '', password: '', age: '' });
  
  // Step 2 State: Medical
  const [conditions, setConditions] = useState({ diabetes: false, hypertension: false, heartDisease: false, stroke: false, depression: false });
  const [medications, setMedications] = useState('');
  const [familyHistory, setFamilyHistory] = useState(''); 
  const [familyHistorySpec, setFamilyHistorySpec] = useState('');
  const [lifestyle, setLifestyle] = useState({ sleep: '', smoking: '', alcohol: '', activity: '' });
  const [symptoms, setSymptoms] = useState({ forgetfulness: false, concentration: false, speech: false });
  const [hasScanReport, setHasScanReport] = useState('');
  const [scanFile, setScanFile] = useState(null);

  // Handlers
  const handleNext = () => {
    if (!pii.name || !pii.email || !pii.password || !pii.age) {
      setError('Please fill out all personal information fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCheckbox = (setter) => (e) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleRadio = (setter) => (e) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Step 2 Validation Ensure radio groups are touched
    if (!familyHistory || !lifestyle.sleep || !lifestyle.smoking || !lifestyle.alcohol || !lifestyle.activity || !hasScanReport) {
      setError('Please complete all mandatory lifestyle, history, and scan report selections.');
      window.scrollTo(0,0);
      return;
    }

    if (hasScanReport === 'yes' && !scanFile) {
      setError('Please upload your scan report if you selected Yes.');
      window.scrollTo(0,0);
      return;
    }

    setLoading(true);
    
    const payload = {
      ...pii,
      conditions,
      medications,
      familyHistory,
      familyHistorySpec: familyHistory === 'yes' ? familyHistorySpec : '',
      lifestyle,
      symptoms,
      hasScanReport,
      scanFileName: scanFile ? scanFile.name : null
    };
    
    try {
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-50 mb-4 shadow-sm border border-primary-100">
            <BrainCircuit className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Create your Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            {step === 1 ? 'Step 1 of 2: Personal Details' : 'Step 2 of 2: Clinical Baseline Survey'}
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={pii.name}
                  onChange={e => setPii({...pii, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={pii.email}
                  onChange={e => setPii({...pii, email: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                  <input
                    type="number" min="18" max="120"
                    value={pii.age}
                    onChange={e => setPii({...pii, age: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={pii.password}
                    onChange={e => setPii({...pii, password: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 mt-8 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Log in</Link>
                </p>
                <button onClick={handleNext} className="btn-primary py-3 px-8 flex items-center">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Conditions */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">1. Existing Conditions</h3>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {['diabetes', 'hypertension', 'heartDisease', 'stroke', 'depression'].map(key => (
                    <label key={key} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="checkbox" name={key} checked={conditions[key]} onChange={handleCheckbox(setConditions)} className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500 border-slate-300" />
                      <span className="text-slate-700 capitalize text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meds */}
              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">2. Current Medications (Optional)</label>
                 <textarea value={medications} onChange={e => setMedications(e.target.value)} rows="2" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 outline-none" placeholder="List medications..." />
              </div>

              {/* Family */}
              <div>
                 <h3 className="text-sm font-semibold text-slate-700 mb-2">3. Family History of Dementia / Alzheimer's? <span className="text-red-500">*</span></h3>
                 <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="family" value="yes" checked={familyHistory === 'yes'} onChange={() => setFamilyHistory('yes')} className="h-5 w-5 text-primary-600 focus:ring-primary-500" />
                      <span className="text-slate-700 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="family" value="no" checked={familyHistory === 'no'} onChange={() => setFamilyHistory('no')} className="h-5 w-5 text-primary-600 focus:ring-primary-500" />
                      <span className="text-slate-700 font-medium">No</span>
                    </label>
                 </div>
                 {familyHistory === 'yes' && (
                    <input type="text" value={familyHistorySpec} onChange={(e) => setFamilyHistorySpec(e.target.value)} placeholder="Please specify relation (e.g. Mother)" className="w-full mt-3 px-4 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-primary-500" />
                 )}
              </div>

              {/* Lifestyle */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">4. Lifestyle Factors</h3>
                <div className="space-y-4 mt-3">
                  <div>
                    <span className="block text-sm font-semibold text-slate-700 mb-2">Sleep Quality <span className="text-red-500">*</span></span>
                    <div className="flex space-x-4">
                       {['good', 'average', 'poor'].map(val => (
                         <label key={val} className="flex items-center space-x-2">
                            <input type="radio" name="sleep" value={val} checked={lifestyle.sleep === val} onChange={handleRadio(setLifestyle)} className="h-4 w-4" />
                            <span className="text-slate-600 capitalize text-sm">{val}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-sm font-semibold text-slate-700 mb-2">Smoke? <span className="text-red-500">*</span></span>
                      <div className="flex space-x-4">
                         {['yes', 'no'].map(val => <label key={val} className="flex items-center space-x-2"><input type="radio" name="smoking" value={val} checked={lifestyle.smoking === val} onChange={handleRadio(setLifestyle)} className="h-4 w-4" /><span className="text-slate-600 capitalize text-sm">{val}</span></label>)}
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-700 mb-2">Alcohol? <span className="text-red-500">*</span></span>
                      <div className="flex space-x-4">
                         {['yes', 'no'].map(val => <label key={val} className="flex items-center space-x-2"><input type="radio" name="alcohol" value={val} checked={lifestyle.alcohol === val} onChange={handleRadio(setLifestyle)} className="h-4 w-4" /><span className="text-slate-600 capitalize text-sm">{val}</span></label>)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-700 mb-2">Activity Level <span className="text-red-500">*</span></span>
                    <div className="flex space-x-6">
                       {['low', 'medium', 'high'].map(val => (
                         <label key={val} className="flex items-center space-x-2">
                            <input type="radio" name="activity" value={val} checked={lifestyle.activity === val} onChange={handleRadio(setLifestyle)} className="h-4 w-4" />
                            <span className="text-slate-600 capitalize text-sm">{val}</span>
                         </label>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">5. Recent Cognitive Symptoms</h3>
                <div className="space-y-2 mt-3">
                  {['forgetfulness', 'concentration', 'speech'].map(key => (
                    <label key={key} className="flex items-center space-x-3 bg-red-50/50 p-3 rounded-lg border border-red-100/50 cursor-pointer hover:bg-red-50 transition-colors">
                      <input type="checkbox" name={key} checked={symptoms[key]} onChange={handleCheckbox(setSymptoms)} className="h-5 w-5 rounded text-red-600 focus:ring-red-500 border-slate-300" />
                      <span className="text-slate-700 capitalize text-sm font-medium">{key === 'concentration' ? 'Difficulty Concentrating' : key === 'speech' ? 'Speech Problems' : key}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Medical Imaging */}
              <div>
                 <h3 className="text-sm font-semibold text-slate-700 mb-2">6. Do you have any MRI or CT scan reports? <span className="text-red-500">*</span></h3>
                 <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="scanReport" value="yes" checked={hasScanReport === 'yes'} onChange={() => setHasScanReport('yes')} className="h-5 w-5 text-primary-600 focus:ring-primary-500" />
                      <span className="text-slate-700 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" name="scanReport" value="no" checked={hasScanReport === 'no'} onChange={() => { setHasScanReport('no'); setScanFile(null); }} className="h-5 w-5 text-primary-600 focus:ring-primary-500" />
                      <span className="text-slate-700 font-medium">No</span>
                    </label>
                 </div>
                 {hasScanReport === 'yes' && (
                    <div className="mt-3">
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setScanFile(e.target.files[0])} 
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors cursor-pointer border border-slate-200 rounded-xl p-2" 
                      />
                      <p className="text-xs text-slate-500 mt-1 pl-1">Supported formats: PDF, JPG, PNG.</p>
                    </div>
                 )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button type="button" onClick={() => { setError(''); setStep(1); }} className="text-slate-500 hover:text-slate-800 font-semibold flex items-center px-4 py-2">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary py-3 px-8 text-lg shadow-md">
                  {loading ? 'Creating...' : 'Complete Account'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}