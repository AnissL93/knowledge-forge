```mermaid-next
swimlane-beta LR

    subgraph User
        A[Submit Request]
    end

    subgraph System
        B[Validate]
        C[Process]
    end

    subgraph Admin
        D[Approve]
    end

    A --> B
    B --> C
    C --> D
```
