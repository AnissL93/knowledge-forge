# Chain-of-Thought Prompting

## Purpose

Improve multi-step reasoning by asking the model to write intermediate steps before the answer.

## Intuition

Each generated token is another forward pass; intermediate steps give the model scratch space.

## Papers Using This Method

- [[Vaswani 2017 - Attention Is All You Need]] (architecture background)

## Can I Use It?

Yes — it is the treatment condition in [[EXP001 - CoT vs direct answering on GSM8K]].

#method
