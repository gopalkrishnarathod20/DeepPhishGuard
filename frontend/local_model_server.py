"""
Run this on your Mac to serve your trained DistilBERT model locally.
Usage: python local_model_server.py
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch, os, re

app = Flask(__name__)
CORS(app)

FT_DIR     = os.path.expanduser('~/LLM_Phishing_Project/finetuned')
MODEL_PATH = f'{FT_DIR}/DistilBERT_final'

print(f'Loading model from {MODEL_PATH}...')
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model     = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()
print('✅ Model loaded — server ready at http://localhost:5001')

def preprocess(email: str) -> str:
    """Strip email headers and clean text — match training data format."""
    lines = email.strip().split('\n')
    # Remove header lines (From:, To:, Subject:, Date:, etc.)
    body_lines = []
    in_headers = True
    for line in lines:
        if in_headers and re.match(r'^(From|To|Subject|Date|CC|BCC|Reply-To|Message-ID|Content-Type|MIME)[\s:]+', line, re.IGNORECASE):
            continue
        else:
            in_headers = False
            body_lines.append(line)
    text = '\n'.join(body_lines).strip()
    # Collapse extra whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    return text or email  # fallback to original if stripping removed everything

@app.route('/classify', methods=['POST'])
def classify():
    email = request.json.get('email', '')
    if not email.strip():
        return jsonify({'error': 'Email is required'}), 400

    text = preprocess(email)

    enc = tokenizer(text, truncation=True, padding='max_length',
                    max_length=128, return_tensors='pt')
    with torch.no_grad():
        logits = model(**enc).logits
    proba = torch.softmax(logits, dim=1)[0].cpu().numpy()
    pred  = int(proba.argmax())
    conf  = float(proba[pred])

    return jsonify({
        'label':      'PHISHING' if pred == 1 else 'LEGITIMATE',
        'confidence': conf,
        'scores': {
            'PHISHING':   float(proba[1]),
            'LEGITIMATE': float(proba[0]),
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model': MODEL_PATH})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
