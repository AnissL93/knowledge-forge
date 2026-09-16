```mermaid-next
flowchart LR
    A[Input] --> B[Process]
    B --> C{Success?}
    C -->|Yes| D[Output]
    C -->|No| B
```
