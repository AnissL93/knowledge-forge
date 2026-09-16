---
type: project
area: research
status: active
created: 2026-09-16
updated: 2026-09-16
---

# LLM Reasoning Study

## Outcome

Understand *when* and *why* large language models reason correctly, and produce a short survey + one experiment-backed finding.

## Why now

Reasoning benchmarks are saturating; the field lacks clean explanations of what prompting actually changes inside the model.

## Current status

- Baseline running, see [[EXP001 - CoT vs direct answering on GSM8K]]

## Next actions

- [ ] Finish [[Vaswani 2017 - Attention Is All You Need]] note 📅 2026-09-20
- [ ] Write experiment plan for [[IDEA - Self-verification prompting]]

## Research / Evidence

- [[In-Context Learning]]
- [[Chain-of-Thought Prompting]]

## Decisions

- Start with math word problems (GSM8K); expand to code later.

## Meetings

- [[2026-09-16 Supervisor Meeting]]

## Work log

### 2026-09-16
- Set up eval harness; direct answering baseline is 18% on the 7B model.

## Related

- [[OpenAI]] · [[LLM inference market]] · [[Positioning - Reasoning Eval Service]]
- Repo: `90_External/llm-reasoning-study` (symlink, not committed)
