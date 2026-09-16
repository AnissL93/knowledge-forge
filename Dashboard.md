---
cssclasses:
  - dashboard
---

# Dashboard

## 🔥 Today

```tasks
not done
happens today
sort by priority
sort by due
```

## ⚠️ Overdue

```tasks
not done
due before today
sort by due
```

## ⏭ Next 7 Days

```tasks
not done
happens after today
happens before in 7 days
sort by happens
```

## 📥 Unscheduled

```tasks
not done
no happens date
sort by priority
limit 15
```

---

## Active Projects

```dataview
TABLE area AS "Area", status AS "Status", updated AS "Updated"
FROM "01_Projects"
WHERE status = "active"
SORT updated DESC
```

## Reading / Research Queue

```dataview
TABLE type AS "Type", status AS "Status", topic AS "Topic"
FROM "02_Sources" OR "10_Business"
WHERE status = "reading" OR status = "researching"
SORT file.mtime DESC
LIMIT 15
```

## Recent Ideas

```dataview
LIST
FROM "06_Ideas"
SORT file.mtime DESC
LIMIT 10
```
