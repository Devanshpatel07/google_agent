# Fine-Tuning Guide for Backlink Hunter AI

This folder contains the dataset generator and QLoRA fine-tuning scripts to train a custom LLM model specifically optimized for **SEO Auditing**, **Toxic Backlink Identification**, and **High-Converting Guest Post Pitching**.

---

## Step 1: Generate Training Dataset

Run the dataset generator script to build `dataset.jsonl`:

```bash
python backend/fine_tune/generate_dataset.py
```

This creates training input/output pairs tailored for the Backlink Hunter AI pipeline.

---

## Step 2: Run Fine-Tuning (Free GPU in Google Colab)

Since fine-tuning requires a GPU (NVIDIA T4, A100, or RTX 3090/4090):

1. Open [Google Colab](https://colab.research.google.com/) (select GPU T4 runtime).
2. Install dependencies:
   ```bash
   pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
   pip install --no-deps xformers trl peft accelerate bitsandbytes datasets
   ```
3. Upload `generate_dataset.py` and `train_model.py`.
4. Run:
   ```bash
   python train_model.py
   ```

---

## Step 3: Connect Your Fine-Tuned Model to the App

### Option A: Hosted via Groq / Fireworks / Together AI
1. Push your fine-tuned model weights to Hugging Face:
   ```python
   model.push_to_hub_merged("your-username/seo-llama-3-custom", tokenizer)
   ```
2. Deploy on your preferred LLM provider.
3. Update `backend/.env`:
   ```env
   GROQ_MODEL=your-username/seo-llama-3-custom
   ```

### Option B: Local Execution via Ollama
1. Export model to GGUF format:
   ```python
   model.save_pretrained_gguf("seo_model", tokenizer)
   ```
2. Create Ollama Model:
   ```bash
   ollama create seo-custom -f Modelfile
   ```
3. Update `backend/.env` to point to your local endpoint or model name.

---

## Summary
Once fine-tuned and deployed, your application's `Custom Fine-Tuning` status changes from **Not trained** $\rightarrow$ **Custom Trained Model Active**!
