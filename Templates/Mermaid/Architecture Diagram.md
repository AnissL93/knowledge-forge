```mermaid-next
architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service server(server)[Server] in api
    service storage(disk)[Storage] in api

    db:L -- R:server
    storage:T -- B:server
```
