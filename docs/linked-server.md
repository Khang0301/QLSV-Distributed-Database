# SQL Server Linked Server setup

## Purpose and status

The application must not join rows from two connections. Site 1 SQL Server
will query Site 2 SQL Server through a Linked Server, so SQL Server performs
the remote access and distributed UNION ALL.

Current status: the Site 1 staging fragments are verified. The Site 2
database/table creation script is prepared, but Machine 2 must run it and
confirm the target tables before connectivity setup. No linked server or
distributed query is configured yet.

## Planned names

| Machine | Database | Linked server |
|---|---|---|
| Machine 1 | QLSV_SITE1 | SITE2_SQL |
| Machine 2 | QLSV_SITE2 | SITE1_SQL (optional reverse direction for tests) |

The core demo only needs SITE2_SQL on Machine 1. Actual host names, IPs,
instance names, and port must be filled in after checking both machines.
Do not assume localhost on Machine 1 refers to Machine 2.

## Prepare SQL Server networking on Machine 2

On Machine 2, in SQL Server Configuration Manager:

1. Open SQL Server Network Configuration → Protocols for the installed instance.
2. Enable TCP/IP.
3. In TCP/IP Properties → IP Addresses, configure or identify a fixed TCP port
   (use 1433 only if that is the port configured for this instance).
4. Restart that SQL Server instance after protocol or port changes.
5. Add a Windows Firewall inbound rule for that TCP port, limited to Machine 1's
   address where practical.
6. From Machine 1, confirm the configured host and port are reachable before
   creating the Linked Server.

If using a named instance with a dynamic port, either configure a fixed port
or ensure SQL Server Browser and UDP 1434 are configured. A fixed port is
easier for this two-machine demo.

## Create the Linked Server on Machine 1

Run this in SSMS connected to Machine 1's Database Engine. Replace the
placeholder data source with the real Machine 2 host/IP and configured port.
Install the Microsoft OLE DB Driver for SQL Server (MSOLEDBSQL) on Machine 1
if it is not already available.

```sql
USE master;
GO

EXEC master.dbo.sp_addlinkedserver
    @server = N'SITE2_SQL',
    @srvproduct = N'',
    @provider = N'MSOLEDBSQL',
    @datasrc = N'<MACHINE2_HOST_OR_IP>,<TCP_PORT>';
GO
```

Use SSMS Server Objects → Linked Servers → SITE2_SQL → Properties → Security
to map the local connection to a dedicated SQL login on Machine 2. Grant that
remote login only the permissions needed to read dbo.Fragment_3 and
dbo.Fragment_4. Keep credentials out of Git and out of screenshots. Do not
use a real password in a committed SQL script.

In the Linked Server properties, ensure Data Access is enabled. RPC and RPC
Out are not needed for SELECT-only distributed queries. If SQL Server reports
that the OLE DB provider is unavailable, install/repair MSOLEDBSQL and restart
the SQL Server service if required.

## Verify the connection

First test the Linked Server:

```sql
EXEC master.dbo.sp_testlinkedserver N'SITE2_SQL';
GO
```

Then query the allocated tables:

```sql
SELECT COUNT(*) AS Fragment3Rows
FROM [SITE2_SQL].[QLSV_SITE2].[dbo].[Fragment_3];

SELECT COUNT(*) AS Fragment4Rows
FROM [SITE2_SQL].[QLSV_SITE2].[dbo].[Fragment_4];
GO
```

At the target-table preparation stage both counts are zero. They should match
the Site 1 source fragment counts after data transfer. A successful connection
test alone does not prove that data has been moved or that reconstruction is
complete.

## Distributed query

After Site 2 contains its allocated rows and Site 1 retains F1/F2, execute at
Machine 1:

```sql
SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_1
UNION ALL
SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_2
UNION ALL
SELECT MA, HT, QQ, NS, GT, DT, TB
FROM [SITE2_SQL].[QLSV_SITE2].[dbo].[Fragment_3]
UNION ALL
SELECT MA, HT, QQ, NS, GT, DT, TB
FROM [SITE2_SQL].[QLSV_SITE2].[dbo].[Fragment_4];
GO
```

The query starts on Site 1. SQL Server reads F1/F2 locally and requests F3/F4
from Site 2 through the Linked Server. The application receives the result
from SQL Server; it does not concatenate results from separate database
connections.

## Failure and recovery checks

With Site 2 stopped or unreachable, a query against dbo.Fragment_1 on Site 1
should still work. The remote count and distributed query should report a
connection/provider error. Record the exact error for the demo; do not treat
every possible SQL Server error as the same message.

After Site 2 is online again, rerun sp_testlinkedserver and the remote counts,
then run the distributed query. Verify total rows, duplicate MA, and both-way
EXCEPT reconstruction checks before declaring recovery complete.
