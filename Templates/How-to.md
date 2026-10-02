---
type: resource  
resource_type: how-to  
status: active  
created: {{DATE:YYYY-MM-DD}}  
updated: {{DATE:YYYY-MM-DD}}  
tags:  
related_projects:
---


# {{VALUE:title}}

## Goal

What am I trying to accomplish?

## When to Use

Use this when:

Do not use this when:

## Environment / Assumptions

- OS:
    
- Machines:
    
- Network:
    
- Required permissions:
    
- Required software:
    
- Other assumptions:
    

## Architecture / Topology

```mermaid-next
flowchart LR
    A[Machine A]
    B[Machine B]
    C[Machine C]

    A --- B
    B --- C
```

## Prerequisites

Before starting:

- [ ]
    
- [ ]
    
- [ ]
    

## Configuration

### Variables

|Name|Value|Notes|
|---|---|---|
|Subnet|||
|Gateway|||
|Interface|||
|DNS|||

## Procedure

### 1. Step One

Explain what this step does.

```bash
# command
```

Expected result:

```text
...
```

### 2. Step Two

```bash
# command
```

### 3. Step Three

```bash
# command
```

## Verification

How do I know it worked?

### Connectivity

```bash
ping ...
```

### Routing

```bash
ip route
```

### Interfaces

```bash
ip addr
```

### Service / Port

```bash
ss -tulpn
```

Success criteria:

- [ ]
    
- [ ]
    
- [ ]
    

## Persistence

How is the configuration made persistent across reboot?

For example:

- NetworkManager
    
- systemd-networkd
    
- netplan
    
- Ansible
    
- Terraform
    
- shell scripts
    

Configuration location:

```text
/path/to/config
```

## Troubleshooting

### Symptom: Machines cannot communicate

Check:

1. interface state
    
2. IP address
    
3. subnet mask
    
4. route
    
5. firewall
    
6. physical / virtual connectivity
    

Useful commands:

```bash
ip addr
ip route
ping ...
traceroute ...
```

### Symptom: Port is unreachable

```bash
ss -tulpn
```

Check firewall:

```bash
sudo nft list ruleset
```

### Symptom: Works until reboot

Check whether configuration is persistent.

## Rollback

How do I undo the configuration safely?

```bash
# rollback commands
```

## Security Notes

- Which machines can access the subnet?
    
- Are any ports exposed externally?
    
- Is encryption required?
    
- Are credentials stored anywhere?
    
- Is firewall isolation configured?
    

## Performance Notes

If relevant:

- bandwidth:
    
- latency:
    
- MTU:
    
- packet loss:
    
- NIC:
    
- switch:
    
- benchmark:
    

Example:

```bash
iperf3 ...
```

## Decisions / Tradeoffs

### Why this approach?

### Alternatives considered

#### Option A

Pros:

Cons:

#### Option B

Pros:

Cons:

## Final Working Configuration

Record the final known-good setup here.

```text
Machine A:
IP:

Machine B:
IP:

Machine C:
IP:
```

## Related Files

- Config:
    
- Script:
    
- Ansible:
    
- Git repository:
    

## Related Concepts

- [[Linux Networking]]
    
- [[Subnet]]
    
- [[Routing]]
    

## Related How-tos

- [[ ]]
    
- [[ ]]
    

## Related Projects

- [[ ]]
    

## References

## Change Log

### {{DATE:YYYY-MM-DD}}

- Initial version.