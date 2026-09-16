```mermaid-next
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains

    USER {
        int id
        string name
    }

    ORDER {
        int id
        date created
    }

    ITEM {
        int id
        string name
    }
```
