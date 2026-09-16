```mermaid-next
wardley-beta

    title AI Infrastructure

    anchor User [0.95, 0.10]

    component AI Product [0.80, 0.30]
    component Inference Engine [0.60, 0.45]
    component GPU [0.40, 0.80]

    User -> AI Product
    AI Product -> Inference Engine
    Inference Engine -> GPU
```
