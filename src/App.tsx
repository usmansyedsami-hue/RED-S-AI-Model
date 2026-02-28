/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  User,
  Stethoscope,
  Dna,
  HeartPulse,
  Menu,
  X
} from 'lucide-react';

// --- Types ---

type Gender = 'male' | 'female' | null;

interface Question {
  id: string;
  text: string;
  category: string;
  type?: 'choice' | 'number';
  options?: {
    label: string;
    value: number;
  }[];
}

type RiskLevel = 'Green' | 'Yellow' | 'Orange' | 'Red';

// --- Constants & Data ---

const FEMALE_QUESTIONS: Question[] = [
  {
    id: 'f1',
    category: 'Training Load',
    text: 'How many hours per week do you train or compete (on average)?',
    type: 'number'
  },
  {
    id: 'f2',
    category: 'Injury History',
    text: 'In the past 12 months, have you missed training or competition due to injury?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 2 }
    ]
  },
  {
    id: 'f3',
    category: 'Injury History',
    text: 'Have you had any bone stress injuries (stress fractures) in the past year?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 4 }
    ]
  },
  {
    id: 'f4',
    category: 'Gastrointestinal',
    text: 'How often do you feel bloated or gassy in your abdomen when not menstruating?',
    options: [
      { label: 'Rarely', value: 0 },
      { label: 'Sometimes', value: 1 },
      { label: 'Often', value: 2 }
    ]
  },
  {
    id: 'f5',
    category: 'Gastrointestinal',
    text: 'How often do you have menstrual cramps or stomachaches unrelated to your period?',
    options: [
      { label: 'Rarely', value: 0 },
      { label: 'Sometimes', value: 1 },
      { label: 'Often', value: 2 }
    ]
  },
  {
    id: 'f6',
    category: 'Gastrointestinal',
    text: 'How often do you typically have bowel movements?',
    options: [
      { label: 'Multiple times per day', value: 0 },
      { label: 'Once per day', value: 0 },
      { label: 'Less than once per day', value: 2 }
    ]
  },
  {
    id: 'f7',
    category: 'Menstrual Function',
    text: 'Are your periods regular (every ~28–35 days)?',
    options: [
      { label: 'Yes, most of the time', value: 0 },
      { label: 'No, I often skip or have irregular cycles', value: 4 }
    ]
  },
  {
    id: 'f8',
    category: 'Menstrual Function',
    text: 'How many menstrual periods have you had in the last 12 months?',
    options: [
      { label: '12+', value: 0 },
      { label: '9–11', value: 1 },
      { label: '6–8', value: 2 },
      { label: '3–5', value: 3 },
      { label: '0–2', value: 4 }
    ]
  },
  {
    id: 'f9',
    category: 'Menstrual Function',
    text: 'Have you ever gone 3 or more consecutive months without a period (not due to pregnancy)?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 4 }
    ]
  },
  {
    id: 'f10',
    category: 'Menstrual Function',
    text: 'How many days do you usually bleed during your period?',
    options: [
      { label: '7+', value: 0 },
      { label: '5–6', value: 0 },
      { label: '3–4', value: 0 },
      { label: '1–2 days', value: 2 }
    ]
  },
  {
    id: 'f11',
    category: 'Menstrual Function',
    text: 'How old were you at your first menstrual period (menarche)?',
    options: [
      { label: '≤14', value: 0 },
      { label: '15 or older', value: 2 },
      { label: 'Don’t remember', value: 0 }
    ]
  },
  {
    id: 'f12',
    category: 'Menstrual Function',
    text: 'Do you currently use hormonal contraception (pill, patch, IUD, etc.)?',
    options: [
      { label: 'Yes', value: 0 },
      { label: 'No', value: 0 }
    ]
  },
  {
    id: 'f13',
    category: 'Energy Availability',
    text: 'Have you lost weight unintentionally in the last 6 months?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 3 }
    ]
  },
  {
    id: 'f14',
    category: 'Energy Availability',
    text: 'Are you currently following a restrictive diet or skipping meals to control weight?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 3 }
    ]
  },
  {
    id: 'f15',
    category: 'Energy Availability',
    text: 'Do you often feel fatigued, lethargic, or unusually low in energy?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 2 }
    ]
  }
];

const MALE_QUESTIONS: Question[] = [
  {
    id: 'm1',
    category: 'Training Load',
    text: 'How many hours per week do you train or compete, on average?',
    type: 'number'
  },
  {
    id: 'm2',
    category: 'Energy Availability',
    text: 'Have you lost weight unintentionally in the last 6 months?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 3 }
    ]
  },
  {
    id: 'm3',
    category: 'Energy Availability',
    text: 'Are you currently trying to lose weight through dieting or increased exercise?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 2 }
    ]
  },
  {
    id: 'm4',
    category: 'Energy Availability',
    text: 'Do you often feel fatigued, exhausted, or lack energy during training and daily life?',
    options: [
      { label: 'Rarely', value: 0 },
      { label: 'Sometimes', value: 1 },
      { label: 'Yes, often', value: 2 }
    ]
  },
  {
    id: 'm5',
    category: 'Recovery',
    text: 'Do you feel physically weak or that you don’t recover well from workouts?',
    options: [
      { label: 'Rarely', value: 0 },
      { label: 'Sometimes', value: 1 },
      { label: 'Often', value: 2 },
      { label: 'Yes, almost always', value: 3 }
    ]
  },
  {
    id: 'm6',
    category: 'Immune System',
    text: 'Have you experienced frequent illnesses (colds, infections) that cause you to miss training?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    id: 'm7',
    category: 'Hormonal Health',
    text: 'How would you describe your current sex drive (libido) compared to your normal?',
    options: [
      { label: 'High', value: 0 },
      { label: 'Moderate', value: 0 },
      { label: 'Low', value: 3 },
      { label: 'None', value: 4 }
    ]
  },
  {
    id: 'm8',
    category: 'Hormonal Health',
    text: 'Is your sex drive lower than it was a year ago?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 3 }
    ]
  },
  {
    id: 'm9',
    category: 'Hormonal Health',
    text: 'How often have you had morning erections in the past month compared to normal?',
    options: [
      { label: 'Normal frequency', value: 0 },
      { label: 'Less often', value: 2 },
      { label: 'None', value: 4 }
    ]
  },
  {
    id: 'm10',
    category: 'Metabolism',
    text: 'Are you often bothered by symptoms of low body temperature (feeling cold all the time)?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    id: 'm11',
    category: 'Bone Health',
    text: 'Have you ever had a stress fracture or bone injury in the last year?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 4 }
    ]
  },
  {
    id: 'm12',
    category: 'Energy Availability',
    text: 'Do you follow any strict or restrictive eating plan (e.g. very low calorie, skipping meals, etc.)?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 3 }
    ]
  },
  {
    id: 'm13',
    category: 'Energy Availability',
    text: 'Do you frequently feel dizzy or have lightheadedness?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    id: 'm14',
    category: 'Psychological',
    text: 'How often do you feel stressed or anxious about training and eating?',
    options: [
      { label: 'Rarely', value: 0 },
      { label: 'Sometimes', value: 1 },
      { label: 'Often', value: 2 }
    ]
  },
  {
    id: 'm15',
    category: 'Performance',
    text: 'Have you noticed any loss of muscle strength or performance recently?',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 2 }
    ]
  }
];

// --- Components ---

// --- Components ---

const ProgressBar = ({ 
  current, 
  total, 
  questions, 
  onNavigate 
}: { 
  current: number; 
  total: number; 
  questions: Question[];
  onNavigate: (index: number) => void;
}) => (
  <div className="w-full flex gap-1 mb-12 h-1">
    {questions.map((q, idx) => {
      const isCompleted = idx < current - 1;
      const isCurrent = idx === current - 1;
      
      return (
        <div key={q.id} className="flex-1 group relative">
          <button
            onClick={() => onNavigate(idx)}
            disabled={idx >= current}
            className={`w-full h-full rounded-full transition-all duration-500 ${
              isCurrent 
                ? 'bg-brand-green shadow-[0_0_15px_rgba(24,177,85,0.6)] scale-y-150' 
                : isCompleted 
                  ? 'bg-brand-green/40 hover:bg-brand-green/60' 
                  : 'bg-brand-black/5'
            }`}
          />
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
            <div className="bg-brand-black text-white text-[9px] font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-2xl border border-white/10">
              <span className="text-brand-green mr-2">STEP {idx + 1}</span>
              <span className="opacity-40 uppercase tracking-[0.2em]">{q.category}</span>
            </div>
            <div className="w-2 h-2 bg-brand-black rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10" />
          </div>
        </div>
      );
    })}
  </div>
);

const HowItWorksModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      >
        {/* Glass Backdrop with Red/Green Gradients */}
        <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-2xl overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-green/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-red/20 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white/40 backdrop-blur-md border border-white/20 rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="p-8 md:p-12 overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-black tracking-tight">How it <span className="text-brand-green">Works</span></h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-black/5 hover:bg-black/10 flex items-center justify-center rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6 text-brand-black/80 font-medium leading-relaxed text-lg">
              <p>
                Relative Energy Deficiency in Sport (RED-S) occurs when an athlete’s energy intake does not adequately support both training demands and essential physiological functions. Over time, this low energy availability can disrupt multiple body systems, including hormonal regulation, bone health, metabolism, immune function, and mental health. RED-S does not appear suddenly as a single diagnosis. Instead, it develops along a continuum, progressing from subtle early symptoms to more serious clinical consequences if left unrecognized. Because many of these early signs are nonspecific or dismissed as normal training fatigue, RED-S is often underdiagnosed until injury or performance decline occurs.
              </p>
              <p>
                Our app uses an AI-based model to help identify RED-S risk earlier and non-invasively. Athletes complete a short, structured questionnaire based on validated tools such as the RED-S CAT2 and the LEA(M/F)-Q, with questions tailored by biological sex. These responses are analyzed by a machine-learning model trained on real clinical reference data and reviewed by physicians during development to ensure medical relevance and safety. The model generates a continuous RED-S risk score on a 1–100 scale, allowing users to see where they fall on the risk spectrum rather than receiving a simple yes-or-no result. This approach is designed to support awareness and early action, while keeping clinicians involved in validation, interpretation, and follow-up when needed.
              </p>
            </div>
          </div>
          
          <div className="p-8 bg-black/5 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-brand-black text-white font-bold rounded-2xl hover:bg-brand-red transition-all active:scale-95"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [step, setStep] = useState<'welcome' | 'gender' | 'quiz' | 'results'>('welcome');
  const [gender, setGender] = useState<Gender>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const questions = gender === 'female' ? FEMALE_QUESTIONS : MALE_QUESTIONS;

  const handleAnswer = (value: number) => {
    const qId = questions[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: value }));
    
    // Small delay for visual feedback before moving to next
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setStep('results');
      }
    }, 300);
  };

  const score = useMemo(() => {
    const total = (Object.entries(answers) as [string, number][]).reduce((acc: number, [qId, val]) => {
      const question = questions.find(q => q.id === qId);
      if (question?.type === 'number') {
        if (val < 10) return acc + 0;
        if (val < 15) return acc + 1;
        if (val < 20) return acc + 2;
        return acc + 3;
      }
      return acc + (val as number);
    }, 0);

    const maxPossible = questions.reduce((acc: number, q: Question) => {
      if (q.type === 'number') return acc + 3;
      return acc + Math.max(...(q.options?.map(o => o.value) || [0]));
    }, 0);

    return maxPossible > 0 ? Math.min(Math.round((total / maxPossible) * 100), 100) : 0;
  }, [answers, questions]);

  const riskInfo = useMemo(() => {
    if (score <= 30) return { level: 'Green' as RiskLevel, color: 'text-brand-green', bg: 'bg-brand-green/10', text: 'Low Risk', desc: 'Proper eating habits and healthy endocrine system. Full sport participation encouraged.' };
    if (score <= 60) return { level: 'Yellow' as RiskLevel, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Moderate Risk', desc: 'Potential low energy availability. Monitoring and dietary adjustment recommended.' };
    if (score <= 85) return { level: 'Orange' as RiskLevel, color: 'text-brand-red', bg: 'bg-brand-red/5', text: 'High Risk', desc: 'Significant risk of RED-S. Clinical assessment and treatment plan highly recommended.' };
    return { level: 'Red' as RiskLevel, color: 'text-brand-red', bg: 'bg-brand-red/10', text: 'Very High Risk', desc: 'Critical energy deficiency. Immediate medical intervention and removal from training may be necessary.' };
  }, [score]);

  const reset = () => {
    setStep('welcome');
    setGender(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-red selection:text-white bg-brand-bg">
      
      {/* --- Header --- */}
      <header className="px-6 py-5 flex justify-between items-center sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-black/5">
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2">
            <div className="w-9 h-9 bg-brand-green flex items-center justify-center rounded-xl shadow-lg shadow-brand-green/20 z-10">
              <Activity size={20} className="text-white" />
            </div>
            <div className="w-9 h-9 bg-brand-red flex items-center justify-center rounded-xl shadow-lg shadow-brand-red/20">
              <HeartPulse size={20} className="text-white" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight ml-2">RED-S <span className="bg-gradient-to-r from-brand-green to-brand-red bg-clip-text text-transparent">AI</span></span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 transition-colors">
          <Menu size={24} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 safe-bottom">
        <AnimatePresence mode="wait">
          
          {/* --- Welcome Screen --- */}
          {step === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-md space-y-10"
            >
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {['REDSCAT2', 'LEAF-Q', 'LEAM-Q'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-brand-black/5 text-[9px] font-bold text-brand-black/40 rounded border border-brand-black/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1]">
                  Understand Your <br />
                  <span className="bg-gradient-to-r from-brand-green to-brand-red bg-clip-text text-transparent">Energy Balance</span>
                </h1>
                <p className="text-lg font-medium text-brand-black/60 leading-relaxed">
                  A non-invasive, AI-driven risk assessment for Relative Energy Deficiency in Sport (RED-S).
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setStep('gender')}
                  className="btn-sleek-primary w-full flex items-center justify-center gap-2 group !bg-brand-green shadow-lg shadow-brand-green/20"
                >
                  Start Assessment
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setShowHowItWorks(true)}
                  className="btn-sleek-outline w-full"
                >
                  How it works
                </button>
              </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="card-sleek p-5 space-y-3 border-l-4 border-brand-green">
                    <div className="w-10 h-10 bg-brand-green/10 flex items-center justify-center rounded-xl">
                      <Stethoscope size={20} className="text-brand-green" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Clinical Standards</p>
                      <p className="text-[10px] text-brand-black/40 leading-tight mt-1">
                        Developed by specialists. Future versions will include direct doctor review for every score.
                      </p>
                    </div>
                  </div>
                  <div className="card-sleek p-5 space-y-3 border-l-4 border-brand-red">
                    <div className="w-10 h-10 bg-brand-red/10 flex items-center justify-center rounded-xl">
                      <Dna size={20} className="text-brand-red" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">AI Optimized</p>
                      <p className="text-[10px] text-brand-black/40 leading-tight mt-1">
                        Gemini AI & ChatGPT Deep Research. Validated by REDSCAT2, LEAF-Q, and LEAM-Q.
                      </p>
                    </div>
                  </div>
                </div>
            </motion.div>
          )}

          {/* --- Gender Selection --- */}
          {step === 'gender' && (
            <motion.div 
              key="gender"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md space-y-8"
            >
              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold tracking-tight">Select Biological Sex</h2>
                <p className="text-brand-black/50 font-medium">Physiological markers differ significantly between sexes.</p>
              </div>
              
              <div className="grid gap-4">
                <button 
                  onClick={() => { setGender('female'); setStep('quiz'); }}
                  className="card-sleek p-8 flex items-center justify-between group hover:border-brand-red transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-brand-red/5 group-hover:bg-brand-red/10 flex items-center justify-center rounded-2xl transition-colors">
                      <User size={28} className="text-brand-red" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Female</span>
                  </div>
                  <ChevronRight size={24} className="text-brand-black/20 group-hover:text-brand-red transition-colors" />
                </button>
                <button 
                  onClick={() => { setGender('male'); setStep('quiz'); }}
                  className="card-sleek p-8 flex items-center justify-between group hover:border-brand-green transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-brand-green/5 group-hover:bg-brand-green/10 flex items-center justify-center rounded-2xl transition-colors">
                      <User size={28} className="text-brand-green" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Male</span>
                  </div>
                  <ChevronRight size={24} className="text-brand-black/20 group-hover:text-brand-green transition-colors" />
                </button>
              </div>
              
              <button 
                onClick={() => setStep('welcome')} 
                className="font-bold text-sm flex items-center gap-2 text-brand-black/40 hover:text-brand-black transition-colors"
              >
                <ChevronLeft size={18} /> Back to start
              </button>
            </motion.div>
          )}

          {/* --- Questionnaire --- */}
          {step === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md"
            >
              <ProgressBar 
                current={currentQuestionIndex + 1} 
                total={questions.length} 
                questions={questions}
                onNavigate={(idx) => setCurrentQuestionIndex(idx)}
              />
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green text-[10px] font-bold uppercase tracking-widest rounded">
                        {questions[currentQuestionIndex].category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight leading-tight">
                      {questions[currentQuestionIndex].text}
                    </h2>
                  </div>
                  
                  <div className="grid gap-3">
                    {questions[currentQuestionIndex].type === 'number' ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-full bg-white border-2 border-brand-black/5 p-6 pr-28 text-4xl font-black outline-none focus:border-brand-green rounded-2xl transition-all"
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) {
                                const qId = questions[currentQuestionIndex].id;
                                setAnswers(prev => ({ ...prev, [qId]: val }));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = parseInt((e.target as HTMLInputElement).value);
                                if (!isNaN(val)) handleAnswer(val);
                              }
                            }}
                            autoFocus
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-black/30 font-bold">hrs/wk</span>
                        </div>
                        <button
                          onClick={() => {
                            const val = answers[questions[currentQuestionIndex].id];
                            if (val !== undefined) handleAnswer(val);
                          }}
                          className="btn-sleek-primary w-full !bg-brand-red shadow-lg shadow-brand-red/20"
                        >
                          Continue
                        </button>
                      </div>
                    ) : (
                      questions[currentQuestionIndex].options?.map((option, idx) => {
                        const isSelected = answers[questions[currentQuestionIndex].id] === option.value;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(option.value)}
                            className={`option-card flex items-center justify-between group ${isSelected ? 'option-card-selected !border-brand-green !bg-brand-green/5' : ''}`}
                          >
                            <span className={`font-bold transition-colors ${isSelected ? 'text-brand-green' : 'text-brand-black'}`}>
                              {option.label}
                            </span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-brand-green bg-brand-green' : 'border-brand-black/10 group-hover:border-brand-black/30'}`}>
                              {isSelected && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
                
                <div className="flex justify-between items-center pt-6">
                  <button 
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="font-bold text-xs flex items-center gap-1.5 text-brand-black/40 hover:text-brand-black disabled:opacity-0 transition-colors"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="text-[10px] font-bold text-brand-black/20">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
            </motion.div>
          )}

          {/* --- Results Screen --- */}
          {step === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md space-y-6"
            >
              <div className="card-sleek overflow-hidden">
                <div className={`${riskInfo.bg} p-12 text-center space-y-3`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-black/40">Your Risk Score</p>
                  <div className={`text-8xl font-black tracking-tighter leading-none ${riskInfo.color}`}>{score}</div>
                  <div className={`text-xl font-bold uppercase tracking-tight ${riskInfo.color}`}>{riskInfo.text}</div>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="flex gap-4 items-start p-4 bg-brand-black/5 rounded-2xl">
                    <div className="p-2 bg-brand-black text-white rounded-xl shrink-0">
                      <Info size={20} />
                    </div>
                    <p className="font-bold text-sm leading-snug text-brand-black/80">{riskInfo.desc}</p>
                  </div>

                  <div className="space-y-5">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-brand-black/30">Recommended Actions</h4>
                    <div className="space-y-3">
                      {['Consult a sports dietitian', 'Review training volume with coach', 'Prioritize sleep and recovery'].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold">
                          <div className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_8px_rgba(24,177,85,0.5)]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid gap-3 pt-4">
                    <button onClick={reset} className="btn-sleek-primary w-full !bg-brand-green shadow-lg shadow-brand-green/20">
                      Retake Assessment
                    </button>
                    <button className="btn-sleek-outline w-full flex items-center justify-center gap-2">
                      Export Results
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 justify-center opacity-20">
                <AlertCircle size={14} />
                <p className="text-[10px] font-bold uppercase">Screening tool only • Not a diagnosis</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      </main>

      {/* --- Footer --- */}
      <footer className="p-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-black/20">
          Houston Early Research Experience
        </p>
      </footer>
    </div>
  );
}
