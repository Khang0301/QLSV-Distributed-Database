/*
    PHASE 8 - Create the four horizontal fragment tables on Site 1.
    These are local staging tables for validating the partition before
    Phase 9 allocation. The source relation dbo.QLSV remains available.
*/
USE QLSV_SITE1;
GO

IF OBJECT_ID(N'dbo.QLSV', N'U') IS NULL
    THROW 50010, 'dbo.QLSV must exist before fragments are created.', 1;
GO

IF OBJECT_ID(N'dbo.Fragment_1', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Fragment_1
    (
        MA VARCHAR(20) NOT NULL,
        HT NVARCHAR(100) NOT NULL,
        QQ NVARCHAR(100) NOT NULL,
        NS SMALLINT NOT NULL,
        GT NVARCHAR(10) NOT NULL,
        DT NVARCHAR(50) NOT NULL,
        TB DECIMAL(4,2) NOT NULL,
        CONSTRAINT PK_Fragment_1 PRIMARY KEY (MA)
    );
END;
GO

IF OBJECT_ID(N'dbo.Fragment_2', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Fragment_2
    (
        MA VARCHAR(20) NOT NULL,
        HT NVARCHAR(100) NOT NULL,
        QQ NVARCHAR(100) NOT NULL,
        NS SMALLINT NOT NULL,
        GT NVARCHAR(10) NOT NULL,
        DT NVARCHAR(50) NOT NULL,
        TB DECIMAL(4,2) NOT NULL,
        CONSTRAINT PK_Fragment_2 PRIMARY KEY (MA)
    );
END;
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
        CONSTRAINT PK_Fragment_3 PRIMARY KEY (MA)
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
        CONSTRAINT PK_Fragment_4 PRIMARY KEY (MA)
    );
END;
GO
