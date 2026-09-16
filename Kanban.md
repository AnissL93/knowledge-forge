---
cssclasses:
  - task-board
---

# Task Board

> This is a query-based Kanban. Tasks stay in their original notes; nothing is copied here.

<div class="task-board-grid">

<div class="task-board-column">

## TODO

```tasks
not done
status.type is TODO
sort by priority
sort by due
```

</div>

<div class="task-board-column">

## DOING

```tasks
not done
status.type is IN_PROGRESS
sort by due
```

</div>

<div class="task-board-column">

## DONE

```tasks
done
done after 7 days ago
sort by done reverse
limit 30
```

</div>

</div>
