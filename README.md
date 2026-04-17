# PhishGuard AI – Phishing Email Detection System

## Overview

PhishGuard AI is an intelligent phishing email detection system developed as part of an MSc Software Engineering project. The system provides a comparative analysis of traditional Machine Learning (ML), Deep Learning (DL), and Large Language Model (LLM) approaches for detecting phishing emails, and deploys the best-performing model in a real-time web application.

---

## Objectives

* Compare ML, DL, and LLM-based models for phishing detection
* Evaluate performance using F1-score, accuracy, precision, and recall
* Assess cross-dataset generalisation
* Investigate computational constraints of LLM deployment
* Develop a real-time phishing detection system

---

## Models Implemented

### Classical Machine Learning

* Logistic Regression
* Random Forest
* XGBoost

### Deep Learning

* Convolutional Neural Network (CNN)
* Bidirectional LSTM (BiLSTM)

### Transformer-based Models

* DistilBERT (Best Performing)
* BERT-base
* RoBERTa-base
* TinyLlama (LoRA Fine-tuning)

---

## Key Results

| Model               | F1 Score | Accuracy |
| ------------------- | -------- | -------- |
| DistilBERT          | 0.9956   | 99.56%   |
| RoBERTa-base        | 0.9866   | 98.66%   |
| BERT-base           | 0.9819   | 98.19%   |
| Logistic Regression | 0.9858   | 98.58%   |
| Random Forest       | 0.9856   | 98.56%   |
| XGBoost             | 0.9780   | 97.80%   |
| TinyLlama           | 0.0000   | Failed   |

### Key Insights

* Transformer models outperform ML and DL approaches in generalisation
* Classical ML models fail on unseen datasets (F1 drops significantly)
* Generative LLMs require substantial computational resources

---

## System Architecture

```
Email Input → Preprocessing → DistilBERT Model → Flask API → Next.js Frontend
```

* Backend: Python (Flask)
* Frontend: Next.js (React + TypeScript)
* Model Serving: Local inference server

---

## Tech Stack

* Python 3.11
* PyTorch
* Hugging Face Transformers
* Scikit-learn
* XGBoost
* Next.js
* Flask

---

## Dataset

* PhishTank
* Kaggle Phishing Dataset
* Enron Email Dataset

Total: 10,000 samples (balanced)
Split: 80% Train / 10% Validation / 10% Test

---

## Features

* Real-time phishing email classification
* Confidence score output
* Human-readable explanation
* Lightweight deployment on consumer hardware

---

## Limitations

* TinyLlama requires GPU for proper convergence
* Dataset limited to English emails
* No adversarial evaluation using AI-generated phishing

---

## Future Work

* GPU-based LLM training
* Adversarial robustness testing
* Multilingual phishing detection
* Continual learning with updated datasets
* Real-world deployment in email systems

---

## How to Run

### Clone the repository

```
git clone https://github.com/gopalkrishnarathod20/DeepPhishGuard.git
cd phishguard-ai
```

### Install dependencies

```
pip install -r requirements.txt
```

### Run backend

```
python app.py
```

### Run frontend

```
npm install
npm run dev
```

---

## Conclusion

DistilBERT provides the best balance of accuracy, generalisation, and efficiency, making it suitable for real-world phishing detection under resource constraints.

---

## Acknowledgements

This project was supported by academic mentors and benefited from open-source tools including Hugging Face Transformers, PyTorch, and Scikit-learn.

---

## License

This project is intended for academic and research purposes.
