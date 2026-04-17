import Nav from '@/components/Nav'
import { Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const TECH_STACK = [
  { cat: 'Languages', items: 'Python 3.11 · TypeScript' },
  { cat: 'ML Libraries', items: 'scikit-learn · PyTorch · Transformers · PEFT · TRL' },
  { cat: 'Models', items: 'DistilBERT · BERT-base · RoBERTa-base · TinyLlama-1.1B' },
  { cat: 'Hardware', items: 'Apple M1 Air 8GB · CPU training · MPS inference' },
  { cat: 'Deployment', items: 'Next.js 14 · Hugging Face Inference API · Vercel' },
  { cat: 'Datasets', items: 'Kaggle Phishing Dataset · CEAS 2008 Spam Corpus' },
]

const PIPELINE = [
  { phase: 'Data', detail: 'Two phishing/email datasets merged, cleaned, balanced (50/50 split)' },
  { phase: 'ML Baseline', detail: 'Logistic Regression, Random Forest, XGBoost with TF-IDF features' },
  { phase: 'Deep Learning', detail: 'TextCNN and BiLSTM with custom tokenisation and word embeddings' },
  { phase: 'Fine-tuned LLMs', detail: 'DistilBERT, BERT-base, RoBERTa full fine-tuning via HuggingFace Trainer' },
  { phase: 'Generative LLM', detail: 'TinyLlama-1.1B with LoRA adapters (r=4) for explainable detection' },
  { phase: 'Evaluation', detail: 'Single-dataset and cross-dataset testing, F1/accuracy/precision/recall' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen grid-bg">
      <Nav />
      <main className="max-w-3xl mx-auto px-8 py-12">

        <div className="mb-10 fade-up-1">
          <p className="font-mono text-[11px] tracking-[0.2em] text-accent mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-accent" />ABOUT THIS PROJECT
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">PhishGuard AI</h1>
          <p className="text-muted text-sm leading-relaxed">
            A research project comparing traditional machine learning, deep learning, and
            large language models for phishing email detection. The key question: do LLMs
            actually understand phishing semantics, or just memorise training patterns?
          </p>
        </div>

        {/* Research question */}
        <section className="mb-10 fade-up-2">
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
            <p className="font-mono text-[10px] tracking-widest text-accent mb-2">RESEARCH QUESTION</p>
            <p className="text-lg font-bold leading-relaxed">
              "Do fine-tuned LLMs generalise across phishing datasets where
              traditional ML models fail?"
            </p>
          </div>
        </section>

        {/* Pipeline */}
        <section className="mb-10 fade-up-2">
          <h2 className="font-mono text-[11px] tracking-widest text-muted mb-4">METHODOLOGY</h2>
          <div className="space-y-3">
            {PIPELINE.map(({ phase, detail }, i) => (
              <div key={phase} className="flex gap-4 items-start">
                <div className="font-mono text-[10px] text-accent bg-accent/10 border border-accent/20 rounded px-2 py-1 shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <p className="text-sm font-bold mb-0.5">{phase}</p>
                  <p className="text-xs text-muted leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-10 fade-up-3">
          <h2 className="font-mono text-[11px] tracking-widest text-muted mb-4">TECH STACK</h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {TECH_STACK.map(({ cat, items }, i) => (
              <div key={cat} className={`flex gap-4 px-5 py-3.5 ${i < TECH_STACK.length - 1 ? 'border-b border-border/50' : ''}`}>
                <span className="font-mono text-[10px] text-muted w-28 shrink-0 mt-0.5">{cat}</span>
                <span className="font-mono text-xs text-white">{items}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hardware note */}
        <section className="mb-10 fade-up-3">
          <div className="bg-warn/5 border border-warn/20 rounded-xl p-5">
            <p className="font-mono text-[10px] tracking-widest text-warn mb-2">HARDWARE NOTE</p>
            <p className="text-sm text-muted leading-relaxed">
              The entire pipeline was trained on an Apple M1 Air with 8GB RAM — no NVIDIA GPU.
              QLoRA was replaced with plain LoRA due to bitsandbytes requiring CUDA.
              This demonstrates that LLM fine-tuning is genuinely accessible on consumer hardware.
            </p>
          </div>
        </section>

        {/* Links */}
        <section className="fade-up-4 flex gap-4">
          <Link
            href="https://huggingface.co"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm font-semibold text-muted hover:border-accent/40 hover:text-accent transition-colors"
          >
            <ExternalLink size={14} /> Hugging Face Model
          </Link>
          <Link
            href="/demo"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-bg rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors"
          >
            Try Live Demo →
          </Link>
        </section>
      </main>
    </div>
  )
}
