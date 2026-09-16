# Mermaid Complete Cheatsheet

> Recommended for Obsidian with Mermaid Next.  
> Copy the diagram you need and edit the content.

---

## 1. Flowchart

Use for workflows, algorithms, and processes.

```mermaid-next
flowchart LR
    A[Input] --> B[Process]
    B --> C{Success?}
    C -->|Yes| D[Output]
    C -->|No| B
```

---

## 2. Swimlane Diagram

Use for workflows where responsibility matters.

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

---

## 3. Sequence Diagram

Use for APIs, service calls, and system interactions.

```mermaid-next
sequenceDiagram
    participant User
    participant App
    participant Server

    User->>App: Click
    App->>Server: Request
    Server-->>App: Response
    App-->>User: Show result
```

---

## 4. Class Diagram

Use for software architecture and object-oriented models.

```mermaid-next
classDiagram

    class Animal {
        +String name
        +eat()
    }

    class Dog {
        +bark()
    }

    Animal <|-- Dog
```

---

## 5. State Diagram

Use for state machines and lifecycle transitions.

```mermaid-next
stateDiagram-v2

    [*] --> Todo
    Todo --> Doing
    Doing --> Done
    Done --> [*]
```

---

## 6. Entity Relationship Diagram

Use for database models.

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
```

---

## 7. User Journey

Use for product and user-experience flows.

```mermaid-next
journey
    title Buying a Product

    section Discover
      Find product: 4: User
      Read reviews: 3: User

    section Purchase
      Add to cart: 5: User
      Pay: 4: User
```

---

## 8. Gantt Chart

Use for project planning and schedules.

```mermaid-next
gantt

    title Research Project
    dateFormat YYYY-MM-DD

    section Research
    Literature Review :a1, 2026-09-01, 7d
    Experiment        :a2, after a1, 10d

    section Writing
    Draft             :a3, after a2, 5d
```

---

## 9. Pie Chart

Use for proportions.

```mermaid-next
pie title Time Allocation

    "Research" : 40
    "Coding" : 30
    "Writing" : 20
    "Meetings" : 10
```

---

## 10. Quadrant Chart

Use for prioritization and competitive positioning.

```mermaid-next
quadrantChart

    title Product Positioning

    x-axis Low Performance --> High Performance
    y-axis Low Cost --> High Cost

    quadrant-1 Premium
    quadrant-2 Expensive
    quadrant-3 Weak
    quadrant-4 High Value

    Product A: [0.8, 0.8]
    Product B: [0.3, 0.7]
    Our Product: [0.8, 0.3]
```

---

## 11. Requirement Diagram

Use for system requirements and SysML-style modeling.

```mermaid-next
requirementDiagram
    requirement performance_req {
        id: "REQ-001"
        text: "Response under 100ms"
        risk: Medium
        verifymethod: Test
    }

    element api {
        type: "service"
        docref: "API Service"
    }

    api - satisfies -> performance_req
```


```mermaid-next
requirementDiagram

    performanceRequirement latency_req {
        id: "REQ-001"
        text: "API response time shall be under 100 ms"
        risk: Medium
        verifymethod: Test
    }

    element api {
        type: "service"
        docref: "API Service"
    }

    api - satisfies -> latency_req
```

---

## 12. Use Case Diagram

Use for actors and system capabilities.

```mermaid-next
usecase-beta
    direction LR

    actor User

    Login("Log in")
    Search("Search")
    Purchase("Purchase")

    User --> Login
    User --> Search
    User --> Purchase
```

---

## 13. Git Graph

Use for branches and merges.

```mermaid-next
gitGraph

    commit
    commit

    branch feature
    checkout feature

    commit
    commit

    checkout main
    merge feature

    commit
```

---

## 14. C4 Diagram

Use for high-level software architecture.

```mermaid-next
C4Context

    title Online Shop

    Person(user, "Customer")

    System(shop, "Online Shop")

    System_Ext(payment, "Payment Provider")

    Rel(user, shop, "Uses")
    Rel(shop, payment, "Pays through")
```

---

## 15. Mindmap

Use for topics, learning maps, and knowledge structures.

```mermaid-next
mindmap
    root((Quant Trading))

        Strategies
            Momentum
            Mean Reversion

        Evaluation
            Backtesting
            Sharpe Ratio

        Risk
            Drawdown
            Leverage
```

---

## 16. Timeline

Use for history, milestones, and evolution.

```mermaid-next
timeline

    title Evolution of a Project

    2024 : Initial Idea
    2025 : Prototype
    2026 : Product Launch
```

---

## 17. Sankey Diagram

Use for flows of money, energy, traffic, or users.

```mermaid-next
sankey

Users,Free Plan,100
Users,Paid Plan,30
Free Plan,Churn,40
Free Plan,Upgrade,20
Paid Plan,Revenue,30
```

Format:

```text
Source,Target,Value
```

---

## 18. Tree View

Use for file trees and hierarchical structures.

```mermaid-next
treeView-beta

    obsidian/
        01_Projects/
            HeteroOpt.md

        02_Source/
            Papers/
            Books/
            Articles/
            Videos/

        03_Concepts/

        06_Ideas/

        07_Writing/
```

---

## 19. XY Chart

Use for benchmarks, line charts, and bar charts.

```mermaid-next
xychart

    title "Hardware Performance"

    x-axis ["CPU", "GPU", "NPU"]
    y-axis "Performance" 0 --> 100

    bar [20, 90, 70]
    line [25, 85, 75]
```

---

## 20. Block Diagram

Use for system modules and component layouts.

```mermaid-next
block-beta

    columns 3

    A["Input"]
    B["AI Optimizer"]
    C["Hardware"]

    A --> B
    B --> C
```

---

## 21. Packet Diagram

Use for network protocols and bit fields.

```mermaid-next
packet

    0-15: "Source Port"
    16-31: "Destination Port"
    32-47: "Length"
    48-63: "Checksum"
```

---

## 22. Kanban

Use for simple task boards.

```mermaid-next
kanban
    todo[Todo]
        task1[Read Paper]
        task2[Run Experiment]

    doing[Doing]
        task3[Write Code]

    done[Done]
        task4[Setup Obsidian]
```

---

## 23. Architecture Diagram

Use for cloud, infrastructure, and service architecture.

```mermaid-next
architecture-beta

    group api(cloud)[API]

    service db(database)[Database] in api
    service server(server)[Server] in api
    service storage(disk)[Storage] in api

    db:L -- R:server
    storage:T -- B:server
```

---

## 24. Radar Diagram

Use for multidimensional comparison.

```mermaid-next
radar-beta

    title Team Skills

    axis Coding, Research, Writing, Product, Sales

    curve Alice{9,8,6,5,3}
    curve Bob{6,5,8,8,7}
```

---

## 25. Event Modeling

Use for event-driven systems and DDD.

```mermaid-next
eventmodeling

    tf 01 ui CartUI
    tf 02 cmd AddItem
    tf 03 evt ItemAdded
    tf 04 rmo CartItems
```

Common entities:

```text
ui   = User Interface
cmd  = Command
evt  = Event
rmo  = Read Model
pcr  = Processor
```

---

## 26. Treemap

Use for hierarchical proportions.

```mermaid-next
treemap-beta

    "Revenue"
        "Product A": 50
        "Product B": 30

    "Services"
        "Consulting": 15
        "Support": 5
```

---

## 27. Venn Diagram

Use for set relationships.

```mermaid-next
venn-beta

    title Good Startup Idea

    set Desirable
    set Feasible
    set Viable

    union Desirable,Feasible["Can build"]

    union Feasible,Viable["Can sustain"]

    union Desirable,Feasible,Viable["Build this"]
```

---

## 28. Ishikawa Diagram

Also called a fishbone or cause-and-effect diagram.

Use for root cause analysis.

```mermaid-next
ishikawa-beta
    Slow AI Inference

    Hardware
        Memory bandwidth
        Low GPU utilization

    Software
        Poor kernel
        Excessive synchronization

    Model
        Large context
        Large batch

    Infrastructure
        Network latency
        Storage bottleneck
```

---

## 29. Wardley Map

Use for strategy, technology evolution, and build-vs-buy thinking.

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

Coordinates:

```text
[Visibility, Evolution]
```

---

## 30. Cynefin Diagram

Use for classifying problems by complexity.

```mermaid-next
cynefin-beta

    title Project Problems

    complex
        "New product discovery"

    complicated
        "GPU performance tuning"

    clear
        "Deploy documentation"

    chaotic
        "Production outage"

    confusion
        "Unknown customer problem"
```

---

# Quick Selection Guide

| What you want to show             | Mermaid type         |
| --------------------------------- | -------------------- |
| Workflow                          | `flowchart`          |
| Responsibility across steps       | `swimlane-beta`      |
| API/system calls                  | `sequenceDiagram`    |
| Object/class relationships        | `classDiagram`       |
| State transitions                 | `stateDiagram-v2`    |
| Database model                    | `erDiagram`          |
| User experience                   | `journey`            |
| Project schedule                  | `gantt`              |
| Proportions                       | `pie`                |
| Competitive positioning           | `quadrantChart`      |
| System requirements               | `requirementDiagram` |
| Actors and system functions       | `usecase-beta`       |
| Git branching                     | `gitGraph`           |
| Software architecture             | `C4Context`          |
| Knowledge structure               | `mindmap`            |
| Historical events                 | `timeline`           |
| Code-like sequence                | `zenuml`             |
| Flow of money/users/energy        | `sankey`             |
| Benchmarks                        | `xychart`            |
| System modules                    | `block-beta`         |
| Network packet structure          | `packet`             |
| Task board                        | `kanban`             |
| Cloud/infrastructure architecture | `architecture-beta`  |
| Multidimensional comparison       | `radar-beta`         |
| Event-driven systems              | `eventmodeling`      |
| Hierarchical proportions          | `treemap-beta`       |
| Set relationships                 | `venn-beta`          |
| Root cause analysis               | `ishikawa-beta`      |
| Strategy mapping                  | `wardley-beta`       |
| Problem complexity                | `cynefin-beta`       |
| File/folder hierarchy             | `treeView-beta`      |

---

# The 8 Most Useful Ones

```text
flowchart
sequenceDiagram
mindmap
timeline
gantt
xychart
quadrantChart
architecture-beta
```

---

# Universal Fallback

When in doubt, start with:

```mermaid-next
flowchart LR
    A[Input]
    B[Process]
    C[Output]

    A --> B --> C
```