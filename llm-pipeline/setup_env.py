#!/usr/bin/env python3
"""
setup_env.py  —  One-click local environment setup for LLM Phishing Detection
Run:  python setup_env.py
"""

import sys, os, subprocess, platform

PY  = sys.executable
OS  = platform.system()      # 'Windows', 'Linux', 'Darwin'
VER = sys.version_info

print("=" * 60)
print("  LLM Phishing Detection — Local Environment Setup")
print("=" * 60)
print(f"  Python  : {sys.version.split()[0]}")
print(f"  OS      : {OS} {platform.release()}")
print(f"  Script  : {__file__}")
print("=" * 60)

# ── Python version check ──
if VER < (3, 9):
    print("\n  Python 3.9+ required. Please upgrade and re-run.")
    sys.exit(1)
print("\n  Python version OK")

# ── Create & activate virtual environment ──
VENV = os.path.join(os.path.dirname(__file__), "phishing_env")

if not os.path.exists(VENV):
    print(f"\n  Creating virtual environment at: {VENV}")
    subprocess.check_call([PY, "-m", "venv", VENV])
else:
    print(f"\n  Virtual environment already exists: {VENV}")

# Path to pip inside the venv
if OS == "Windows":
    venv_pip     = os.path.join(VENV, "Scripts", "pip.exe")
    venv_python  = os.path.join(VENV, "Scripts", "python.exe")
    activate_cmd = f"call {VENV}\\Scripts\\activate"
else:
    venv_pip     = os.path.join(VENV, "bin", "pip")
    venv_python  = os.path.join(VENV, "bin", "python")
    activate_cmd = f"source {VENV}/bin/activate"

# ── Upgrade pip inside venv ──
print("\n  Upgrading pip...")
subprocess.check_call([venv_pip, "install", "--upgrade", "pip", "-q"])

# ── Detect CUDA / Apple Silicon ──
def has_cuda():
    try:
        out = subprocess.check_output(["nvidia-smi"], stderr=subprocess.DEVNULL).decode()
        return "NVIDIA" in out or "GPU" in out
    except Exception:
        return False

def is_apple_silicon():
    return OS == "Darwin" and platform.processor() == "arm"

CUDA          = has_cuda()
APPLE_SILICON = is_apple_silicon()

print(f"\n  GPU Detection:")
print(f"    CUDA GPU       : {' Yes' if CUDA else ' No'}")
print(f"    Apple Silicon  : {' Yes' if APPLE_SILICON else ' No'}")

# ── Install PyTorch (platform-specific) ──
print("\n  Installing PyTorch...")
if CUDA:
    # CUDA 12.1 — works for 30xx/40xx series. Adjust index URL for older GPUs.
    subprocess.check_call([
        venv_pip, "install", "-q",
        "torch", "torchvision", "torchaudio",
        "--index-url", "https://download.pytorch.org/whl/cu121"
    ])
    print("    Installed PyTorch with CUDA 12.1 support")
elif APPLE_SILICON:
    subprocess.check_call([
        venv_pip, "install", "-q",
        "torch", "torchvision", "torchaudio"
    ])
    print("    Installed PyTorch with MPS (Apple Silicon) support")
else:
    subprocess.check_call([
        venv_pip, "install", "-q",
        "torch", "torchvision", "torchaudio",
        "--index-url", "https://download.pytorch.org/whl/cpu"
    ])
    print("    Installed PyTorch (CPU only)")

# ── Install bitsandbytes (required for QLoRA in Notebook 2) ──
print("\n  Installing bitsandbytes (QLoRA support)...")
if CUDA and OS in ("Linux", "Windows"):
    subprocess.check_call([venv_pip, "install", "-q", "bitsandbytes>=0.41.0"])
    print("    bitsandbytes installed (CUDA QLoRA enabled)")
elif APPLE_SILICON:
    # bitsandbytes-apple-silicon is a community port
    try:
        subprocess.check_call([venv_pip, "install", "-q", "bitsandbytes"])
        print("    bitsandbytes installed (limited MPS support)")
    except Exception:
        print("      bitsandbytes not available for Apple Silicon")
        print("       Notebook 2 QLoRA cell will be skipped automatically")
else:
    print("      No GPU — bitsandbytes/QLoRA won't work")
    print("       Encoder models (DistilBERT/BERT/RoBERTa) will run on CPU fine")
    print("       Generative LLM (Mistral/TinyLlama) requires a CUDA GPU")

# ── Install all other requirements ──
print("\n  Installing remaining packages...")
req_file = os.path.join(os.path.dirname(__file__), "requirements.txt")
if os.path.exists(req_file):
    subprocess.check_call([
        venv_pip, "install", "-q", "-r", req_file,
        "--ignore-requires-python"
    ])
else:
    # Inline fallback if requirements.txt is missing
    pkgs = [
        "transformers==4.46.0", "datasets>=2.14.0",
        "accelerate>=0.24.0", "peft>=0.7.0", "trl>=0.7.0",
        "scikit-learn>=1.3.0", "xgboost>=2.0.0",
        "imbalanced-learn>=0.11.0", "pandas>=2.0.0",
        "numpy>=1.24.0", "nltk>=3.8.0", "beautifulsoup4>=4.12.0",
        "requests>=2.31.0", "matplotlib>=3.7.0", "seaborn>=0.12.0",
        "joblib>=1.3.0", "sentencepiece>=0.1.99", "protobuf>=3.20.0",
        "packaging>=23.0", "jupyter>=1.0.0", "ipykernel>=6.25.0",
        "ipywidgets>=8.0.0"
    ]
    subprocess.check_call([venv_pip, "install", "-q"] + pkgs)

# ── Register Jupyter kernel so notebooks use the venv ──
print("\n  Registering Jupyter kernel...")
subprocess.check_call([
    venv_python, "-m", "ipykernel", "install",
    "--user", "--name=phishing_env",
    "--display-name=Python (phishing_env)"
])
print("    Kernel 'Python (phishing_env)' registered")

# ── Download NLTK data ──
print("\n  Downloading NLTK data...")
subprocess.check_call([
    venv_python, "-c",
    "import nltk; nltk.download('stopwords', quiet=True); nltk.download('punkt', quiet=True); print('NLTK data ready')"
])

# ── Verify installation ──
print("\n  Verifying installation...")
verify_script = """
import torch, transformers, sklearn, xgboost, peft
print(f"  torch        : {torch.__version__}  (CUDA={torch.cuda.is_available()})")
print(f"  transformers : {transformers.__version__}")
print(f"  sklearn      : {sklearn.__version__}")
print(f"  xgboost      : {xgboost.__version__}")
print(f"  peft         : {peft.__version__}")
"""
subprocess.check_call([venv_python, "-c", verify_script])

# ── Final instructions ──
print("\n" + "=" * 60)
print("    SETUP COMPLETE")
print("=" * 60)

if CUDA:
    print("    CUDA GPU detected — all features enabled (encoder + generative)")
elif APPLE_SILICON:
    print("    Apple Silicon — encoder models work via MPS")
    print("      In Notebook 2 CELL 11, change device_map='auto' to device_map='mps'")
    print("      QLoRA generative fine-tuning not supported on MPS")
else:
    print("     CPU only — encoder models will train (slowly)")
    print("      Notebook 2 Generative (Mistral/TinyLlama) cells require a GPU")
    print("      Consider Google Colab free tier for the generative section")

print()
