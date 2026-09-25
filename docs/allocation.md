# Phase 9 — Fragment allocation

## Allocation decision

The workload assumptions in predicates.md give Application 1 most of its
filtered reads in the Hanoi group and Application 2 most of its filtered
reads outside Hanoi. Allocate the Hanoi fragments to Site 1 and the other
fragments to Site 2:

| Fragment | Predicate | Site | Reason |
|---|---|---|---|
| F1 | QQ = N'Hà Nội' AND TB >= 8 | Site 1 | Hanoi group, primarily requested by Application 1 |
| F2 | QQ = N'Hà Nội' AND TB < 8 | Site 1 | Hanoi group, primarily requested by Application 1 |
| F3 | QQ <> N'Hà Nội' AND TB >= 8 | Site 2 | Outside-Hanoi group, primarily requested by Application 2 |
| F4 | QQ <> N'Hà Nội' AND TB < 8 | Site 2 | Outside-Hanoi group, primarily requested by Application 2 |

This is a workload-based assumption for the course demo, not a location rule
from the assignment. Q5 reads all students, so it will use distributed
reconstruction across both sites.

## Machine and files

- Machine 1: QLSV_SITE1 keeps Fragment_1 and Fragment_2.
- Machine 2: QLSV_SITE2 holds Fragment_3 and Fragment_4.
- Site 2 preparation script: database/site2/09_create_allocated_fragments.sql.

Run the Site 2 script locally on Machine 2, connected to its SQL Server
instance. It creates QLSV_SITE2 if needed and creates empty F3/F4 tables with
the same columns, types, primary keys and minterm checks. Its final query
should show both fragments with zero rows at this preparation stage.

## Safe migration order

Phase 8 currently has all four staging fragments on Site 1. Keep F3/F4 there
until Site 2 is reachable and their rows have been copied and verified. The
copy will use SQL Server Linked Server in the following phases. Before
removing staging copies or changing the source table, verify on the two actual
machines that F3/F4 counts and values match Site 1 and that global
reconstruction is complete and disjoint. The Site 2 preparation script does
not copy student rows and does not delete Site 1 data.

## Verification

On Site 2, after running the preparation script, confirm QLSV_SITE2 is ONLINE
and dbo.Fragment_3 and dbo.Fragment_4 each exist with zero rows. Inspect
columns, keys and check constraints using Object Explorer or:

```sql
USE QLSV_SITE2;
GO
EXEC sp_help 'dbo.Fragment_3';
EXEC sp_help 'dbo.Fragment_4';
GO
```

Do not treat empty Site 2 tables as a completed data migration. They confirm
the allocation targets are ready. Actual row transfer and distributed
reconstruction are verified after cross-site connectivity is available.
