/*
    PHASE 3 - QLSV source relation

    Logical relation: QLSV(MA, HT, QQ, NS, GT, DT, TB)

    dbo.QLSV is the design/source relation used before fragmentation.
    It is not intended to remain as a full copy on both sites in the
    final distributed allocation.
*/

USE QLSV_SITE1;
GO

IF OBJECT_ID(N'dbo.QLSV', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.QLSV
    (
        MA  VARCHAR(20)    NOT NULL,
        HT  NVARCHAR(100)  NOT NULL,
        QQ  NVARCHAR(100)  NOT NULL,
        NS  SMALLINT       NOT NULL,
        GT  NVARCHAR(10)   NOT NULL,
        DT  NVARCHAR(50)   NOT NULL,
        TB  DECIMAL(4,2)   NOT NULL
    );
END;
GO
