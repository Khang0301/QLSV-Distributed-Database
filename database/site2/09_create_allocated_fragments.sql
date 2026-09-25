/*
    PHASE 9 - Prepare Site 2 for its allocated horizontal fragments.
    Run on Machine 2, connected to its local SQL Server instance.
    Creates empty destination tables for F3 and F4; data transfer follows
    after the cross-site connection is configured and tested.
*/
USE master;
GO

IF DB_ID(N'QLSV_SITE2') IS NULL
BEGIN
    CREATE DATABASE QLSV_SITE2;
END;
GO

USE QLSV_SITE2;
GO

IF OBJECT_ID(N'dbo.Fragment_3', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Fragment_3
    (
        MA VARCHAR(20) NOT NULL,
        HT NVARCHAR(100) NOT NULL,
        QQ NVARCHAR(100) NOT NULL,
        NS SMALLINT NOT NULL,
        GT NVARCHAR(10) NOT NULL,
        DT NVARCHAR(50) NOT NULL,
        TB DECIMAL(4,2) NOT NULL,
        CONSTRAINT PK_Fragment_3 PRIMARY KEY (MA),
        CONSTRAINT CK_Fragment_3_Minterm
            CHECK (QQ <> N'Hà Nội' AND TB >= 8),
        CONSTRAINT CK_Fragment_3_NS
            CHECK (NS BETWEEN 1900 AND 2100),
        CONSTRAINT CK_Fragment_3_GT
            CHECK (GT IN (N'Nam', N'Nữ', N'Khác')),
        CONSTRAINT CK_Fragment_3_TB
            CHECK (TB >= 0 AND TB <= 10)
    );
END;
GO

IF OBJECT_ID(N'dbo.Fragment_4', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Fragment_4
    (
        MA VARCHAR(20) NOT NULL,
        HT NVARCHAR(100) NOT NULL,
        QQ NVARCHAR(100) NOT NULL,
        NS SMALLINT NOT NULL,
        GT NVARCHAR(10) NOT NULL,
        DT NVARCHAR(50) NOT NULL,
        TB DECIMAL(4,2) NOT NULL,
        CONSTRAINT PK_Fragment_4 PRIMARY KEY (MA),
        CONSTRAINT CK_Fragment_4_Minterm
            CHECK (QQ <> N'Hà Nội' AND TB < 8),
        CONSTRAINT CK_Fragment_4_NS
            CHECK (NS BETWEEN 1900 AND 2100),
        CONSTRAINT CK_Fragment_4_GT
            CHECK (GT IN (N'Nam', N'Nữ', N'Khác')),
        CONSTRAINT CK_Fragment_4_TB
            CHECK (TB >= 0 AND TB <= 10)
    );
END;
GO

-- Expected at this allocation-preparation stage: tables exist and are empty.
SELECT t.name AS AllocatedFragment, SUM(p.rows) AS RowsInFragment
FROM sys.tables AS t
JOIN sys.partitions AS p ON p.object_id = t.object_id AND p.index_id IN (0, 1)
WHERE t.schema_id = SCHEMA_ID(N'dbo')
  AND t.name IN (N'Fragment_3', N'Fragment_4')
GROUP BY t.name
ORDER BY t.name;
GO
