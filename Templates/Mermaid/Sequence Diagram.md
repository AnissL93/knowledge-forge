```mermaid-next
sequenceDiagram
    participant User
    participant App
    participant Server

    User->>App: Request
    App->>Server: API call
    Server-->>App: Response
    App-->>User: Result
```
