'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import { Shield, AlertTriangle, CheckCircle, Loader2, Zap, RotateCcw, Info } from 'lucide-react'

const SAMPLE_PHISHING = `Subject: Urgent: Verify your account now

Dear account holder,

Your account access has been suspended due to suspicious login attempts. You must verify your account within 24 hours to avoid permanent suspension.

Click here to verify: http://paypa1-secure.tk/verify?session=84729

Enter your username, password and credit card details to restore access.

Failure to verify will result in permanent account termination.

Security Team`

const SAMPLE_LEGIT = `From: james.wilson@company.com
Subject: Team meeting Thursday

Hi Sarah,

Just confirming our team meeting is still on for Thursday at 2pm in Conference Room B.
I have attached the agenda and Q3 slides for your review beforehand.

Let me know if you have any questions.

Best regards,
James Wilson`

type Indicator = { label: string; detail: string }
type Result = {
  label: 'PHISHING' | 'LEGITIMATE'
  confidence: number
  scores: { PHISHING: number; LEGITIMATE: number }
  indicators: Indicator[]
  reason: string
  source?: string
}

export default function DemoPage() {
  const [email, setEmail]     = useState('')
  const [result, setResult]   = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function analyse() {
    if (!email.trim()) return
    setLoading(true); setResult(null); setError('')
    try {
      const res  = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.status === 503 || data.loading) {
        setError(`Model warming up — wait ${data.estimated ?? 20}s and try again.`)
        return
      }
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
      setResult(data as Result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally { setLoading(false) }
  }

  function reset() { setEmail(''); setResult(null); setError('') }

  return (
    <div className="min-h-screen grid-bg">
      <Nav />
      <main className="max-w-3xl mx-auto px-8 py-12">

        <div className="mb-10 fade-up-1">
          <p className="font-mono text-[11px] tracking-[0.2em] text-accent mb-3 flex items-center gap-2">
            <span className="w-4 h-px bg-accent" />LIVE DETECTION
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Phishing Email Analyser</h1>
          <p className="text-muted text-sm leading-relaxed">
            Paste any email to get an instant verdict powered by your fine-tuned DistilBERT (99.56% F1).
          </p>
        </div>

        {/* Sample buttons */}
        <div className="flex gap-3 mb-4 fade-up-2">
          <button
            onClick={() => { setEmail(SAMPLE_PHISHING); setResult(null); setError('') }}
            className="px-3 py-1.5 bg-danger/10 border border-danger/30 text-danger text-xs font-semibold rounded hover:bg-danger/20 transition-colors flex items-center gap-1.5">
            <AlertTriangle size={11} /> Load Phishing Sample
          </button>
          <button
            onClick={() => { setEmail(SAMPLE_LEGIT); setResult(null); setError('') }}
            className="px-3 py-1.5 bg-safe/10 border border-safe/30 text-safe text-xs font-semibold rounded hover:bg-safe/20 transition-colors flex items-center gap-1.5">
            <CheckCircle size={11} /> Load Legitimate Sample
          </button>
        </div>

        {/* Textarea */}
        <div className="fade-up-3 mb-5">
          <div className="relative">
            <div className="absolute top-3 left-3 font-mono text-[10px] text-muted tracking-widest pointer-events-none">EMAIL CONTENT</div>
            <textarea
              value={email}
              onChange={e => { setEmail(e.target.value); setResult(null) }}
              placeholder={`Paste the full email here...`}
              rows={10}
              className="w-full bg-surface border border-border rounded-lg px-4 pt-8 pb-4 font-mono text-sm text-white placeholder-muted/50 focus:outline-none focus:border-accent/50 resize-none transition-colors leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 font-mono text-[10px] text-muted">{email.length} chars</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8 fade-up-4">
          <button
            onClick={analyse}
            disabled={!email.trim() || loading}
            className="flex-1 py-3 bg-accent text-bg font-bold rounded text-sm hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analysing...</> : <><Zap size={16} /> Analyse Email</>}
          </button>
          {(result || email) && (
            <button onClick={reset} className="px-4 py-3 border border-border rounded text-sm font-semibold hover:border-accent/30 transition-colors flex items-center gap-2 text-muted hover:text-white">
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-danger/10 border border-danger/30 rounded-lg p-4 font-mono text-sm text-danger">⚠ {error}</div>
        )}

        {result && (
          <div className={`rounded-xl border p-6 fade-up space-y-5 ${result.label === 'PHISHING' ? 'bg-danger/5 border-danger/30' : 'bg-safe/5 border-safe/30'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${result.label === 'PHISHING' ? 'bg-danger/20' : 'bg-safe/20'}`}>
                {result.label === 'PHISHING' ? <AlertTriangle size={26} className="text-danger" /> : <Shield size={26} className="text-safe" />}
              </div>
              <div>
                <p className={`text-2xl font-extrabold tracking-tight ${result.label === 'PHISHING' ? 'text-danger' : 'text-safe'}`}>{result.label}</p>
                <p className="font-mono text-xs text-muted mt-0.5">{(result.confidence * 100).toFixed(1)}% confidence</p>
              </div>
            </div>

            <div className="space-y-3">
              {([
                { key: 'PHISHING'   as const, color: 'bg-danger', label: 'Phishing Score'   },
                { key: 'LEGITIMATE' as const, color: 'bg-safe',   label: 'Legitimate Score' },
              ]).map(({ key, color, label }) => (
                <div key={key}>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-muted">{label}</span>
                    <span className="text-white">{(result.scores[key] * 100).toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${result.scores[key] * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {result.reason && (
              <div className={`rounded-lg p-4 ${result.label === 'PHISHING' ? 'bg-danger/10 border border-danger/20' : 'bg-safe/10 border border-safe/20'}`}>
                <p className="font-mono text-[10px] tracking-widest text-muted mb-2 flex items-center gap-1.5">
                  <Info size={11} /> WHY THIS VERDICT
                </p>
                <p className="text-sm text-white leading-relaxed">{result.reason}</p>
              </div>
            )}

            {result.indicators?.length > 0 && (
              <div>
                <p className="font-mono text-[10px] tracking-widest text-muted mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={11} className="text-danger" /> PHISHING INDICATORS ({result.indicators.length})
                </p>
                <div className="space-y-2">
                  {result.indicators.map((ind, i) => (
                    <div key={i} className="bg-danger/5 border border-danger/15 rounded-lg px-4 py-3">
                      <p className="text-xs font-bold text-danger mb-0.5">{ind.label}</p>
                      <p className="text-xs text-muted leading-relaxed">{ind.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/5">
              <p className="font-mono text-[10px] text-muted">{result.source ?? 'BERT Classifier'} · PhishGuard AI · 2025–26</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-8 text-center fade-up">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 hex-pulse" style={{ background:'linear-gradient(135deg,#00e5ff22,#00e5ff44)', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }} />
              <Loader2 size={24} className="text-accent absolute inset-0 m-auto animate-spin" />
            </div>
            <p className="font-mono text-xs text-accent tracking-widest">SCANNING EMAIL</p>
            <p className="font-mono text-xs text-muted mt-1">Analysing with DistilBERT...</p>
          </div>
        )}
      </main>
    </div>
  )
}
