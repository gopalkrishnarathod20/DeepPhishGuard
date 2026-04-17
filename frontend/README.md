# PhishGuard AI — Next.js Demo

Phishing detection research demo using HuggingFace Inference API.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
# Follow prompts — done in 2 min. You get a live URL.
```

## Upload Your Model to Hugging Face

After Notebook 2 finishes training, run this in a new notebook cell:

```python
from huggingface_hub import HfApi, login

# 1. Login (get token from huggingface.co/settings/tokens)
login(token="hf_your_token_here")

# 2. Upload DistilBERT (your best encoder model)
api = HfApi()
api.create_repo("phishguard-distilbert", repo_type="model", exist_ok=True)

from transformers import AutoModelForSequenceClassification, AutoTokenizer
model = AutoModelForSequenceClassification.from_pretrained(f'{FT_DIR}/DistilBERT_final')
tokenizer = AutoTokenizer.from_pretrained(f'{FT_DIR}/DistilBERT_final')

model.push_to_hub("YOUR-HF-USERNAME/phishguard-distilbert")
tokenizer.push_to_hub("YOUR-HF-USERNAME/phishguard-distilbert")
print("✅ Model uploaded!")
```

## Update Model Name in Demo

After uploading, edit `app/demo/page.tsx` line 7:
```ts
const HF_MODEL = 'YOUR-HF-USERNAME/phishguard-distilbert'
```

Replace `YOUR-HF-USERNAME` with your actual HF username.

## Pages

| Route      | Description                              |
|------------|------------------------------------------|
| `/`        | Landing page with pipeline overview      |
| `/demo`    | Live email analyser (HF API)             |
| `/results` | Full results table + charts              |
| `/about`   | Methodology and tech stack               |

## Project Structure

```
phishguard/
├── app/
│   ├── layout.tsx       # Root layout + fonts
│   ├── globals.css      # Global styles + animations
│   ├── page.tsx         # Home/landing
│   ├── demo/page.tsx    # Live analyser
│   ├── results/page.tsx # Results + charts
│   └── about/page.tsx   # About page
├── components/
│   └── Nav.tsx          # Shared navigation
├── package.json
├── tailwind.config.js
└── next.config.js
```
