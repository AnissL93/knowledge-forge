```mermaid-next
C4Context
    title Online Shop

    Person(user, "Customer")
    System(shop, "Online Shop")
    System_Ext(payment, "Payment Provider")

    Rel(user, shop, "Uses")
    Rel(shop, payment, "Pays through")
```
