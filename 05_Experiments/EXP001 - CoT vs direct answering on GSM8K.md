---
type: experiment
status: running
created: 2026-09-16
tags: [experiment]
---

# EXP001 - CoT vs direct answering on GSM8K

## Research Question

How much does [[Chain-of-Thought Prompting]] improve a 7B model on GSM8K versus direct answering?

## Hypothesis

If the model gets scratch space, then accuracy rises by more than 15 points.

## Setup

Dataset: GSM8K test (1319 problems)
Model: 7B open-weights, greedy decoding
Code commit: abc1234

## Results

| Metric | Direct | CoT |
| --- | --- | --- |
| Accuracy | 18% | |

## Next Experiment

[[EXP002 - Self-verification on GSM8K]]

#experiment
