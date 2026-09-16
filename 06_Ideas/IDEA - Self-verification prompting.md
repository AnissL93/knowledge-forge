---
type: idea
status: seed
created: 2026-09-16
---

# IDEA - Self-verification prompting

## Idea

After the chain of thought, ask the model to check each step against the question before committing to an answer.

## Why

Most errors in [[EXP001 - CoT vs direct answering on GSM8K]] are arithmetic slips in otherwise correct chains → [[Chain-of-Thought Prompting]].

## Evidence

- [[Vaswani 2017 - Attention Is All You Need]]

## Possible Experiment

Ablate with/without the verification step on the same 7B model.

## Status

- [x] Seed
- [ ] Worth exploring
- [ ] Experimenting
- [ ] Confirmed
- [ ] Dropped

#idea
