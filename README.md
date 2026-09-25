# QLSV Distributed Database

Distributed Database project for the Distributed Database course.

## Architecture

The system consists of two SQL Server sites:

- Site 1: Machine 1
- Site 2: Machine 2

The project uses:

- SQL Server 2022
- SQL Server Management Studio
- T-SQL
- SQL Server Linked Server
- MSOLEDBSQL
- Node.js
- Express.js
- mssql
- React
- Vite

## Main Concepts

- Simple Predicates
- COM_MIN
- Minterms
- Horizontal Fragmentation
- Fragment Allocation
- Distributed Query
- Reconstruction
- Completeness
- Disjointness
- Failure and Recovery

## Repository Structure

```text
docs/
database/
app-site1/
app-site2/
```

## Key documentation

- [Database design](docs/database-design.md): QLSV schema, assumptions, constraints, and fragment tables.
- [Predicates](docs/predicates.md), [COM_MIN](docs/com-min.md), [minterms](docs/minterms.md), and [fragmentation](docs/fragmentation.md): design derivation and verification.
- [Fragment allocation](docs/allocation.md): target site assignment and migration order.
- [Linked Server](docs/linked-server.md): network preparation, setup, query, and failure checks.
- [Database environment](docs/database-environment.md): machine and SQL Server settings.
