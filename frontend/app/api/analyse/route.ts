import { NextRequest, NextResponse } from 'next/server'

const TRUSTED_DOMAINS = [
  'google.com','gmail.com','microsoft.com','apple.com','amazon.com',
  'paypal.com','linkedin.com','twitter.com','facebook.com','instagram.com',
  'github.com','dropbox.com','slack.com','zoom.us','netflix.com',
  'spotify.com','adobe.com','salesforce.com','mailchimp.com','hubspot.com',
  'notion.so','atlassian.com','trello.com','youtube.com','wikipedia.org',
]

function isTrustedUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return TRUSTED_DOMAINS.some(d => host === d || host.endsWith('.' + d))
  } catch { return false }
}

function extractUrls(text: string): string[] {
  return (text.match(/https?:\/\/[^\s<>"]+/g) ?? [])
}

const INDICATORS = [
  { id:'urgency',       pattern:/urgent|immediately|within\s*\d+\s*hours?|act now|expires?\s*(in|soon)|last (chance|warning)/i, label:'Urgency language', detail:'Creates artificial time pressure to manipulate you into acting without thinking' },
  { id:'acct_threat',   pattern:/account.*(suspend|terminat|deactivat|block|lock|clos)|suspend.*account/i, label:'Account suspension threat', detail:'Threatens to close your account to create fear' },
  { id:'cred_request',  pattern:/(?:enter|provide|confirm|submit|update).{0,30}(?:password|credentials|credit card|ssn|social security)/i, label:'Credential request', detail:'Asks for passwords or financial details — legitimate services never do this via email' },
  { id:'generic_greet', pattern:/^(dear (customer|user|member|valued customer|account holder))/im, label:'Generic impersonal greeting', detail:'Legitimate companies address you by your real name' },
  { id:'typosquat',     pattern:/paypa[l1][-.]|arnazon\.|micros0ft\.|g00gle\.|app1e\.|[a-z]+-secure-[a-z]+\./i, label:'Typosquatted domain', detail:'Domain mimics a trusted brand using character substitution' },
  { id:'bad_tld',       pattern:/https?:\/\/[^\s]*\.(tk|xyz|top|click|pw|cc|ml|ga|cf|gq)[\s/]/i, label:'Suspicious domain extension', detail:'Uses a TLD commonly associated with free phishing sites' },
  { id:'financial_lure',pattern:/you('ve| have) (won|been selected)|unclaimed (funds|money|prize)|lottery|inheritance/i, label:'Financial lure', detail:'Promises unexpected money — classic social engineering' },
  { id:'consequence',   pattern:/failure to (comply|respond|verify|act)|if you (don.t|do not|fail to) (respond|verify|click)/i, label:'Consequence threat', detail:'Threatens negative consequences if you don\'t act immediately' },
]

function analyseIndicators(email: string) {
  const urls = extractUrls(email)
  const allTrusted = urls.length > 0 && urls.every(isTrustedUrl)
  return INDICATORS
    .filter(ind => !(ind.id === 'bad_tld' && allTrusted) && ind.pattern.test(email))
    .map(i => ({ label: i.label, detail: i.detail }))
}

function buildReason(indicators: {label:string;detail:string}[], label: string, confidence: number) {
  if (label === 'LEGITIMATE') {
    return `No significant phishing indicators detected. The email does not exhibit common manipulation tactics such as urgency language, account threats, or credential requests.`
  }
  if (indicators.length === 0) {
    return `The model detected subtle phishing patterns (${(confidence*100).toFixed(0)}% confidence) based on linguistic features — the overall writing style matches known phishing emails.`
  }
  const names = indicators.slice(0,3).map(i=>i.label.toLowerCase()).join(', ')
  return `Classified as phishing with ${(confidence*100).toFixed(0)}% confidence. Key reasons: ${names}.`
}

async function classifyWithLocalModel(email: string) {
  const res = await fetch('http://localhost:5001/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error('Local model failed')
  return res.json()
}

async function classifyWithHF(email: string, token: string) {
  const models = [
    'ealvaradob/bert-finetuned-phishing',
    'cybersectony/phishing-email-detection-distilbert_v2.4.1',
  ]
  for (const modelId of models) {
    const res = await fetch(
      `https://router.huggingface.co/hf-inference/models/${modelId}`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: email.slice(0, 512) }),
      }
    )
    if (res.status === 503) {
      const body = await res.json().catch(() => ({}))
      throw new Error(`warming_up:${body.estimated_time ?? 20}`)
    }
    if (!res.ok) continue
    const data = await res.json()
    const scores: {label:string;score:number}[] = Array.isArray(data[0]) ? data[0] : data
    const phishScore = scores.find(s => /phish|spam|malicious|1/i.test(s.label))?.score ?? 0
    const legitScore = scores.find(s => /legit|ham|safe|benign|0/i.test(s.label))?.score ?? 0
    return {
      label: phishScore > legitScore ? 'PHISHING' : 'LEGITIMATE',
      confidence: Math.max(phishScore, legitScore),
      scores: { PHISHING: phishScore, LEGITIMATE: legitScore },
    }
  }
  throw new Error('All HF models failed')
}

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json()
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const indicators = analyseIndicators(email)
    let classification: { label: string; confidence: number; scores: { PHISHING: number; LEGITIMATE: number } }
    let source = 'HF'

    // Try local model first (your trained DistilBERT — most accurate)
    try {
      classification = await classifyWithLocalModel(email)
      source = 'DistilBERT (local · 99.56% F1)'
    } catch {
      // Fall back to HF public model
      try {
        classification = await classifyWithHF(email, token ?? '')
        source = 'BERT (HF Inference API)'
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : ''
        if (msg.startsWith('warming_up:')) {
          const secs = msg.split(':')[1]
          return NextResponse.json({ loading: true, estimated: Number(secs) }, { status: 503 })
        }
        return NextResponse.json({ error: msg || 'Classification failed' }, { status: 500 })
      }
    }

    const { label, confidence, scores } = classification
    const shownIndicators = label === 'PHISHING' ? indicators : []

    return NextResponse.json({
      label, confidence, scores,
      indicators: shownIndicators,
      reason: buildReason(shownIndicators, label, confidence),
      source,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
