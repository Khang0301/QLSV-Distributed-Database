/*
    PHASE 3 - QLSV constraints

    Design assumptions (the assignment does not specify these domains):
    - Birth year is between 1900 and 2100 inclusive.
    - Gender is one of Nam, Nữ, or Khác.
    - Average score is between 0.00 and 10.00 inclusive.
*/

USE QLSV_SITE1;
GO

IF OBJECT_ID(N'dbo.QLSV', N'U') IS NULL
    THROW 50001, 'dbo.QLSV must exist before constraints are applied.', 1;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.key_constraints
    WHERE parent_object_id = OBJECT_ID(N'dbo.QLSV')
      AND name = N'PK_QLSV'
)
BEGIN
    ALTER TABLE dbo.QLSV
        ADD CONSTRAINT PK_QLSV PRIMARY KEY (MA);
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID(N'dbo.QLSV')
      AND name = N'CK_QLSV_NS'
)
BEGIN
    ALTER TABLE dbo.QLSV
        ADD CONSTRAINT CK_QLSV_NS CHECK (NS BETWEEN 1900 AND 2100);
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID(N'dbo.QLSV')
      AND name = N'CK_QLSV_GT'
)
BEGIN
    ALTER TABLE dbo.QLSV
        ADD CONSTRAINT CK_QLSV_GT CHECK (GT IN (N'Nam', N'Nữ', N'Khác'));
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID(N'dbo.QLSV')
      AND name = N'CK_QLSV_TB'
)
BEGIN
    ALTER TABLE dbo.QLSV
        ADD CONSTRAINT CK_QLSV_TB CHECK (TB >= 0 AND TB <= 10);
END;
GO
