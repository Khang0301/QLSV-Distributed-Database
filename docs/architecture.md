# Distributed Database Architecture

## 1. Project Overview
This project implements a distributed database system for the QLSV relation.
The system uses two SQL Server sites deployed on two different machines.

## 2. Global Relation
QLSV(MA, HT, QQ, NS, GT, DT, TB)

Where:
- MA: Student ID
- HT: Full name
- QQ: Hometown
- NS: Year of birth
- GT: Gender
- DT: Ethnicity
- TB: Grade point average

## 3. Physical Sites
### Site 1 (Machine 1)
- SQL Server 1
- Database: QLSV_SITE1
- Fragments: F1, F2

### Site 2 (Machine 2)
- SQL Server 2
- Database: QLSV_SITE2
- Fragments: F3, F4

## 4. Distributed Query & Technology Stack
- Primary mechanism: SQL Server Linked Server (UNION ALL)
- Database: SQL Server 2022
- Backend: Node.js, Express.js
- Frontend: React
