"""
Fine-Tuning Script for Backlink Hunter AI using Unsloth (QLoRA).
Run this script on a GPU instance (e.g. Google Colab T4 GPU or local NVIDIA GPU).

Usage:
1. python backend/fine_tune/generate_dataset.py
2. python backend/fine_tune/train_model.py
"""

import os
import sys

def main():
    dataset_file = os.path.join(os.path.dirname(__file__), "dataset.jsonl")
    if not os.path.exists(dataset_file):
        print("Dataset file not found! Generating dataset first...")
        from generate_dataset import generate_dataset
        generate_dataset()

    print("Checking training environment dependencies...")
    try:
        import torch
        from unsloth import FastLanguageModel
        from datasets import load_dataset
        from trl import SFTTrainer
        from transformers import TrainingArguments
    except ImportError as e:
        print(f"\n[!] Missing dependency: {e}")
        print("\nTo fine-tune this model on Google Colab or GPU server, install:")
        print("pip install \"unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git\"")
        print("pip install --no-deps xformers trl peft accelerate bitsandbytes datasets")
        print("\nOr follow the step-by-step guide in backend/fine_tune/README.md")
        return

    print("1. Loading Llama 3 Base Model (4-bit quantization)...")
    max_seq_length = 2048
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name="unsloth/llama-3-8b-Instruct-bnb-4bit",
        max_seq_length=max_seq_length,
        load_in_4bit=True,
    )

    print("2. Configuring LoRA Adapters...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_alpha=16,
        lora_dropout=0,
        bias="none",
        use_gradient_checkpointing="unsloth",
    )

    print("3. Loading Dataset...")
    dataset = load_dataset("json", data_files={"train": dataset_file})

    def formatting_prompts_func(examples):
        instructions = examples["instruction"]
        inputs = examples["input"]
        outputs = examples["output"]
        texts = []
        for inst, inp, out in zip(instructions, inputs, outputs):
            text = f"### Instruction:\n{inst}\n\n### Input:\n{inp}\n\n### Response:\n{out}"
            texts.append(text)
        return {"text": texts}

    dataset = dataset.map(formatting_prompts_func, batched=True)

    print("4. Starting SFT Fine-Tuning Trainer...")
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset["train"],
        dataset_text_field="text",
        max_seq_length=max_seq_length,
        dataset_num_proc=2,
        packing=False,
        args=TrainingArguments(
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            warmup_steps=5,
            max_steps=60,
            learning_rate=2e-4,
            fp16=not torch.cuda.is_bf16_supported(),
            bf16=torch.cuda.is_bf16_supported(),
            logging_steps=1,
            optim="adamw_8bit",
            weight_decay=0.01,
            lr_scheduler_type="linear",
            seed=3407,
            output_dir="outputs",
        ),
    )

    trainer_stats = trainer.train()
    print("Fine-Tuning Complete! Stats:", trainer_stats)

    output_dir = os.path.join(os.path.dirname(__file__), "fine_tuned_model")
    print(f"Saving merged model to: {output_dir}")
    model.save_pretrained_merged(output_dir, tokenizer, save_method="merged_16bit")
    print("Model saved successfully!")

if __name__ == "__main__":
    main()
