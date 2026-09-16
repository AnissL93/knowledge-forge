```mermaid
flowchart LR
  Q[Question] --> P[Prompt: direct / CoT / CoT + verify]
  P --> M[7B model]
  M --> A[Answer]
  A --> S[Score vs GSM8K]
```
