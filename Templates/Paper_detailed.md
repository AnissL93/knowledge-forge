---
type: paper
status: unread
created:
  "{ date }":
paper_title:
authors:
year:
venue:
doi:
url:
tags:
topics:
rating:
---

# {{title}}

## 0. Before Reading

> **The goal is not to decide whether “everything has already been done.” The goal is to identify what this paper leaves open.**

By the end of this paper, I should produce:

- **10 research questions**
    
- **1 promising research question**
    
- **1 minimum viable experiment**
    

---

# 1. One-Sentence Positioning

### What problem is this paper trying to solve?

### What did the authors actually do?

### What is the main result?

### If I had to summarize the contribution in one sentence:

> **The authors show / propose that:**

---

# 2. What Exact Piece of the Research Space Does This Paper Cover?

## Problem

## Setting

- Data:
    
- Task:
    
- Input:
    
- Output:
    
- Environment:
    
- Assumptions:
    

## Method

## Evaluation

- Dataset:
    
- Baselines:
    
- Metrics:
    
- Main experiment:
    

## Main claim

> **What the paper actually demonstrates is:**

Be specific.

Avoid:

> “Method A works well.”

Prefer:

> “Under dataset X, metric Y, and model scale Z, method A outperforms baseline B by ___.”

---

# 3. What Assumptions Does the Paper Depend On?

List at least five.

-  Assumption 1:
    
-  Assumption 2:
    
-  Assumption 3:
    
-  Assumption 4:
    
-  Assumption 5:
    

### Which assumption seems the most fragile?

### What would happen if this assumption were violated?

---

# 4. Look for Anomalies, Not Just the Best Results

### What is the strangest experimental result?

### In which setting does the method perform worst?

### Is there high variance or instability?

### Which ablation result surprised me?

### Is there a component that can be removed with little performance loss?

### Is there any result the authors do not explain convincingly?

---

# 5. What Did the Authors NOT Do?

## Explicit limitations mentioned by the authors

## Limitations they did not explicitly mention

## Untested settings

- Data:
    
- Domain:
    
- Scale:
    
- Distribution shift:
    
- Extreme cases:
    
- Real-world setting:
    

---

# 6. Force Yourself to Generate 10 Research Questions

## Q1 — Boundary Question

**When does this method fail?**

Possible experiment:

---

## Q2 — Mechanism Question

**Why does this method work?**

Possible explanations:

How could I distinguish between these explanations?

---

## Q3 — Necessity Question

**Which components of the method are actually necessary?**

Minimum test:

---

## Q4 — Simplification Question

**Can a much simpler method achieve similar results?**

Most important simple baseline to try:

---

## Q5 — Generalization Question

**Does the conclusion still hold under a different condition?**

Possible dimensions:

- Dataset
    
- Domain
    
- Population
    
- Modality
    
- Model size
    
- Language
    
- Task
    
- Distribution
    

My question:

---

## Q6 — Scaling Question

**Does the conclusion change as data, model size, or compute changes?**

What I actually want to understand:

---

## Q7 — Reversal / Counterfactual Question

**What happens if I reverse one of the authors' key design choices?**

For example:

> The authors argue A → B.  
> If A is removed, does B actually disappear?

Experiment:

---

## Q8 — Contradiction Question

**Does this paper conflict with another paper?**

Related papers:

- [[ ]]
    
- [[ ]]
    

Conflict:

> Paper A claims:  
> Paper B claims:

Why might the conclusions differ?

Possible reasons:

---

## Q9 — Hidden Variable Question

**Could a third variable explain both the method and the observed effect?**

The paper assumes:

> A → B

An alternative explanation might be:

> C → A  
> C → B

How could I test this?

---

## Q10 — Next-Layer Question

**If this paper is completely correct, what is the next natural question?**

Then ask again:

> **Why is this question worth answering?**

---

# 7. Generate 3 Weird Questions

For this section, ignore whether the idea is publishable.

### Crazy Q1

### Crazy Q2

### Crazy Q3

---

# 8. Filter the 10 Questions

|Question|Important?|Novel?|Testable?|Cheap to Test?|Interesting to Me?|
|---|--:|--:|--:|--:|--:|
|Q1||||||
|Q2||||||
|Q3||||||
|Q4||||||
|Q5||||||
|Q6||||||
|Q7||||||
|Q8||||||
|Q9||||||
|Q10||||||

---

# 9. The One Question Worth Pursuing

## Research Question

> **Existing work shows that ______, but it is still unclear whether / why ______.**

> **My question is: under ______ conditions, does / why does ______?**

---

# 10. Hypotheses

### H1

### Alternative hypothesis

### If H1 is wrong, what would I learn?

This is important.

If:

> “If the experiment fails, I learn nothing.”

then the research question may not be well designed yet.

Ideally:

> Both outcome A and outcome B help distinguish between competing explanations.

---

# 11. Minimum Viable Experiment

Do not design the whole paper yet.

### What is the cheapest experiment that could test the idea?

### Data

### Baseline

### Variables

Independent variable:

Dependent variable:

Control variables:

### What result would support my hypothesis?

### What result would challenge or falsify it?

---

# 12. If the Result Is True — So What?

Suppose the experiment shows:

Why does this matter?

What would this change about how we understand the problem?

Who would care?

---

# 13. How Does This Connect to My Research?

### Can use directly

### Can borrow

### Can challenge

### Can extend

### Not relevant for now

---

# 14. Final Output

## What the authors finished:

## What the authors did NOT finish:

## The gap I find most interesting:

## My research question:

## The first thing I can do tomorrow:

- [ ]
    

---

# 15. Closing Sentence

> **This paper is not evidence that there is nothing left to do. It helps me see the research space more clearly.**

## Links

Related:

- [[ ]]
    

Contradicting:

- [[ ]]
    

Methods:

- [[ ]]
    

Datasets:

- [[ ]]
    

Follow-up ideas:

- [[ ]]