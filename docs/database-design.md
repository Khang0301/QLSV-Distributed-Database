# Database design

## Scope and status

This document records the logical QLSV schema and the current horizontal
fragment design for the course project. The assignment supplies the relation
QLSV(MA, HT, QQ, NS, GT, DT, TB); business domains such as gender and birth
year are design assumptions listed below.

Status on 2026-09-25: Site 1 schema, sample data, predicates, COM_MIN,
minterms, and local staging fragments have been run and confirmed by the
developer. The Site 2 allocated tables are prepared in source but still need
to be run on Machine 2. Linked Server is not configured yet.

## Logical relation

| Attribute | Meaning | SQL Server type | Nulls | Rule |
|---|---|---|---|---|
| MA | Student identifier | VARCHAR(20) | NOT NULL | Primary key |
| HT | Full name | NVARCHAR(100) | NOT NULL | Unicode Vietnamese names |
| QQ | Hometown | NVARCHAR(100) | NOT NULL | Unicode location |
| NS | Birth year | SMALLINT | NOT NULL | Assumption: 1900–2100 |
| GT | Gender | NVARCHAR(10) | NOT NULL | Assumption: Nam, Nữ, Khác |
| DT | Ethnicity | NVARCHAR(50) | NOT NULL | Unicode value |
| TB | Average score | DECIMAL(4,2) | NOT NULL | Assumption: 0.00–10.00 |

TB uses DECIMAL rather than FLOAT so boundary values such as 8.00 and 10.00
are represented exactly. DECIMAL(4,2) can store 10.00. The year range and
gender domain are project assumptions because the assignment does not
specify them. No DEFAULT or foreign key is needed for this single relation.
The primary key supplies an index on MA. Workload-specific indexes are
deferred until query design and measurements justify them.

## Source and physical fragments

During the design phase, dbo.QLSV in QLSV_SITE1 is the complete source
relation used to test fragmentation. It is not the intended final physical
copy at both sites.

The final allocation decision follows the assumed query workload:

| Fragment | Definition | Current staging | Intended final site |
|---|---|---|---|
| Fragment_1 | QQ = N'Hà Nội' AND TB >= 8 | QLSV_SITE1 | QLSV_SITE1 |
| Fragment_2 | QQ = N'Hà Nội' AND TB < 8 | QLSV_SITE1 | QLSV_SITE1 |
| Fragment_3 | QQ <> N'Hà Nội' AND TB >= 8 | QLSV_SITE1 | QLSV_SITE2 |
| Fragment_4 | QQ <> N'Hà Nội' AND TB < 8 | QLSV_SITE1 | QLSV_SITE2 |

Each fragment keeps all seven columns and uses MA as its primary key. A CHECK
constraint enforces its minterm. The source and the four local staging
tables can coexist during development for verification. Before final
integration, transfer F3/F4 to Machine 2 and verify global reconstruction;
do not remove source/staging data before that verification.

## Predicate design reference

The final predicate set is p1 = QQ = N'Hà Nội' and p2 = TB >= 8. The four
minterms (p1,p2), (p1,NOT p2), (NOT p1,p2), and (NOT p1,NOT p2) are disjoint
and complete because QQ and TB are NOT NULL. See predicates.md, com-min.md,
minterms.md, fragmentation.md, and allocation.md for the workload assumptions
and derivation.

The current 60-row seed has fragment counts 0, 10, 25, and 25. Fragment_1
is logically valid but has no sample row yet. This is a test-data coverage
gap and should be addressed before integration demos that exercise a row in
every physical fragment.

## Implementation files

- Site 1 schema: database/site1/01_create_database.sql through 05_indexes.sql
- Seed data: database/site1/06_seed_data.sql
- Predicate and design phases: database/site1/07_predicates.sql through 09_minterms.sql
- Local fragmentation: database/site1/10_fragments.sql and 11_fragment_constraints.sql
- Site 2 allocated fragment tables: database/site2/09_create_allocated_fragments.sql
