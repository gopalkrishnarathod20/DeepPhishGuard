import Link from 'next/link'
import { Shield, Zap, BarChart3, Brain, ArrowRight, CheckCircle } from 'lucide-react'

const PIPELINE_STEPS = [
  { step: '01', label: 'Traditional ML',  models: 'Logistic Regression · Random Forest · XGBoost', color: 'text-warn',     border: 'border-warn/20',     bg: 'bg-warn/5'     },
  { step: '02', label: 'Deep Learning',   models: 'TextCNN · BiLSTM',                               color: 'text-accent',   border: 'border-accent/20',   bg: 'bg-accent/5'   },
  { step: '03', label: 'Fine-tuned LLMs', models: 'DistilBERT · BERT-base · RoBERTa',               color: 'text-safe',     border: 'border-safe/20',     bg: 'bg-safe/5'     },
  { step: '04', label: 'Generative LLM',  models: 'TinyLlama-1.1B + LoRA (CPU)',                    color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/5' },
]

const KEY_FINDINGS = [
  'DistilBERT achieves 99.56% F1 — best across all 9 models, 12ms inference',
  'Traditional ML collapses on cross-dataset tests (62–65% vs 98.6% single-dataset)',
  'Encoder LLMs maintain 94–97% F1 cross-dataset, confirming superior generalisation',
  'TinyLlama-1.1B requires GPU training — 1 epoch CPU produces degenerate output',
]

export default function Home() {
  return (
    <div className="min-h-screen grid-bg">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 hex-pulse" style={{ background:'linear-gradient(135deg,#00e5ff,#0077aa)', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
          <div>
            <p className="font-bold text-sm tracking-tight">PhishGuard AI</p>
            <p className="font-mono text-[10px] text-accent tracking-widest">RESEARCH DEMO</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[{href:'/',label:'Home'},{href:'/demo',label:'Live Demo'},{href:'/results',label:'Results'},{href:'/about',label:'About'}].map(({href,label})=>(
            <Link key={href} href={href} className="px-4 py-2 text-sm font-semibold text-muted hover:text-white transition-colors rounded">{label}</Link>
          ))}
          <Link href="/demo" className="ml-2 px-4 py-2 text-sm font-bold bg-accent text-bg rounded hover:bg-accent/90 transition-colors flex items-center gap-2">
            Try Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 pt-20 pb-12">
        <p className="font-mono text-[11px] tracking-[0.2em] text-accent mb-4 flex items-center gap-2 fade-up-1">
          <span className="w-5 h-px bg-accent inline-block" /> MACHINE LEARNING RESEARCH · 2025–26
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-[-0.04em] mb-6 fade-up-2">
          Detecting Phishing<br /><span className="text-accent glow-text">with LLMs</span>
        </h1>
        <p className="text-lg text-muted max-w-xl leading-relaxed mb-10 fade-up-3">
          A comparative pipeline spanning traditional ML, deep learning, and fine-tuned transformer models —
          trained entirely on Apple M1 Air with no NVIDIA GPU.
        </p>
        <div className="flex items-center gap-4 fade-up-4">
          <Link href="/demo" className="px-6 py-3 bg-accent text-bg font-bold rounded text-sm hover:bg-accent/90 transition-all hover:scale-105 flex items-center gap-2">
            <Zap size={16} /> Analyse an Email
          </Link>
          <Link href="/results" className="px-6 py-3 border border-border text-sm font-semibold rounded hover:border-accent/50 hover:text-accent transition-colors flex items-center gap-2">
            <BarChart3 size={16} /> View Results
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-12 border-t border-border">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted mb-2">THE PIPELINE</p>
        <h2 className="text-2xl font-extrabold tracking-tight mb-8">Four-Stage Detection Architecture</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map(({step,label,models,color,border,bg})=>(
            <div key={step} className={`${bg} border ${border} rounded-lg p-5`}>
              <p className={`font-mono text-xs ${color} mb-3 tracking-widest`}>{step}</p>
              <p className="font-bold text-sm mb-2">{label}</p>
              <p className="font-mono text-[10px] text-muted leading-relaxed">{models}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-12 border-t border-border">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted mb-2">KEY FINDINGS</p>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6">What We Discovered</h2>
            <ul className="space-y-3">
              {KEY_FINDINGS.map((f,i)=>(
                <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                  <CheckCircle size={16} className="text-safe mt-0.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            {[
              { label: 'DistilBERT F1 (best model)', value: 99.56, color: 'bg-safe'   },
              { label: 'Traditional ML F1',           value: 98.6,  color: 'bg-warn'   },
              { label: 'ML Cross-Dataset F1',         value: 63,    color: 'bg-danger'  },
              { label: 'LLM Cross-Dataset F1',        value: 96,    color: 'bg-accent'  },
            ].map(({label,value,color})=>(
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted font-mono">{label}</span>
                  <span className="text-white font-bold font-mono">{value}%</span>
                </div>
                <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width:`${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 py-12 border-t border-border">
        <div className="bg-surface2 border border-border rounded-xl p-10 text-center">
          <Brain size={32} className="text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Try the Live Detector</h2>
          <p className="text-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Paste any email and get an instant phishing verdict powered by your fine-tuned DistilBERT model hosted on Hugging Face.
          </p>
          <Link href="/demo" className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-bg font-bold rounded text-sm hover:bg-accent/90 transition-all">
            Open Live Demo <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-8 py-6 text-center">
        <p className="font-mono text-[11px] text-muted tracking-widest">
          PHISHGUARD AI · ML RESEARCH PROJECT · APPLE M1 AIR · DISTILBERT 99.56% F1
        </p>
      </footer>
    </div>
  )
}
