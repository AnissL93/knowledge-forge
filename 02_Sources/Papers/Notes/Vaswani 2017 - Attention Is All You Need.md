---
type: source
source_type: paper
status: reading
title: "Attention Is All You Need"
authors: ["Ashish Vaswani", "Noam Shazeer"]
year: "2017"
venue: "NeurIPS"
citation_key: "vaswani2017attention"
doi: "10.48550/arXiv.1706.03762"
url: "https://arxiv.org/abs/1706.03762"
zotero:
highlights: "[[Attention Is All You Need - vaswani2017attention]]"
created: 2026-09-16
tags: [paper]
projects: ["[[LLM Reasoning Study]]"]
---

# Vaswani 2017 - Attention Is All You Need

## Why am I reading this?

Foundation for everything in [[LLM Reasoning Study]]; I want the residual-stream view, not just the architecture diagram.

## Core Idea

Replace recurrence with self-attention so every token can read every other token in one step; stack layers and let position encodings carry order.

## Connection to My Research

- Supports: attention heads are the natural unit for interpreting [[In-Context Learning]]
- Conflicts with: nothing yet
- Methods I can borrow: attention-map inspection for [[Chain-of-Thought Prompting]] traces
- Where I can cite it: Background → Architecture

## New Ideas

- [[IDEA - Self-verification prompting]]
