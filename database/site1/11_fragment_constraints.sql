/*
    PHASE 8 - Enforce minterm predicates, populate, and validate fragments.
    Re-running refreshes only these four staging tables from dbo.QLSV.
*/
USE QLSV_SITE1;
GO

IF OBJECT_ID(N'dbo.QLSV', N'U') IS NULL
   OR OBJECT_ID(N'dbo.Fragment_1', N'U') IS NULL
   OR OBJECT_ID(N'dbo.Fragment_2', N'U') IS NULL
   OR OBJECT_ID(N'dbo.Fragment_3', N'U') IS NULL
   OR OBJECT_ID(N'dbo.Fragment_4', N'U') IS NULL
    THROW 50011, 'Run 10_fragments.sql and verify dbo.QLSV first.', 1;
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID(N'dbo.Fragment_1') AND name = N'CK_Fragment_1_Minterm')
    ALTER TABLE dbo.Fragment_1 WITH CHECK ADD CONSTRAINT CK_Fragment_1_Minterm CHECK (QQ = N'Hà Nội' AND TB >= 8);
GO
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID(N'dbo.Fragment_2') AND name = N'CK_Fragment_2_Minterm')
    ALTER TABLE dbo.Fragment_2 WITH CHECK ADD CONSTRAINT CK_Fragment_2_Minterm CHECK (QQ = N'Hà Nội' AND TB < 8);
GO
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID(N'dbo.Fragment_3') AND name = N'CK_Fragment_3_Minterm')
    ALTER TABLE dbo.Fragment_3 WITH CHECK ADD CONSTRAINT CK_Fragment_3_Minterm CHECK (QQ <> N'Hà Nội' AND TB >= 8);
GO
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID(N'dbo.Fragment_4') AND name = N'CK_Fragment_4_Minterm')
    ALTER TABLE dbo.Fragment_4 WITH CHECK ADD CONSTRAINT CK_Fragment_4_Minterm CHECK (QQ <> N'Hà Nội' AND TB < 8);
GO

SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    DELETE FROM dbo.Fragment_1;
    DELETE FROM dbo.Fragment_2;
    DELETE FROM dbo.Fragment_3;
    DELETE FROM dbo.Fragment_4;

    INSERT INTO dbo.Fragment_1 (MA, HT, QQ, NS, GT, DT, TB)
    SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV
    WHERE QQ = N'Hà Nội' AND TB >= 8;
    INSERT INTO dbo.Fragment_2 (MA, HT, QQ, NS, GT, DT, TB)
    SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV
    WHERE QQ = N'Hà Nội' AND TB < 8;
    INSERT INTO dbo.Fragment_3 (MA, HT, QQ, NS, GT, DT, TB)
    SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV
    WHERE QQ <> N'Hà Nội' AND TB >= 8;
    INSERT INTO dbo.Fragment_4 (MA, HT, QQ, NS, GT, DT, TB)
    SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV
    WHERE QQ <> N'Hà Nội' AND TB < 8;

    DECLARE @FragmentRows TABLE
    (
        MA VARCHAR(20) NOT NULL,
        HT NVARCHAR(100) NOT NULL,
        QQ NVARCHAR(100) NOT NULL,
        NS SMALLINT NOT NULL,
        GT NVARCHAR(10) NOT NULL,
        DT NVARCHAR(50) NOT NULL,
        TB DECIMAL(4,2) NOT NULL
    );
    INSERT INTO @FragmentRows (MA, HT, QQ, NS, GT, DT, TB)
    SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_1
    UNION ALL SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_2
    UNION ALL SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_3
    UNION ALL SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_4;

    IF EXISTS
    (
        SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV
        EXCEPT SELECT MA, HT, QQ, NS, GT, DT, TB FROM @FragmentRows
    )
        THROW 50012, 'Completeness failed: rows are missing from fragments.', 1;
    IF EXISTS
    (
        SELECT MA, HT, QQ, NS, GT, DT, TB FROM @FragmentRows
        EXCEPT SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV
    )
        THROW 50013, 'Reconstruction failed: fragments have extra or changed rows.', 1;
    IF EXISTS (SELECT MA FROM @FragmentRows GROUP BY MA HAVING COUNT(*) > 1)
        THROW 50014, 'Disjointness failed: a student occurs in multiple fragments.', 1;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
GO

-- Result 1: counts per fragment, including empty m1.
SELECT FragmentId, Minterm, RowsInFragment
FROM
(
    SELECT 1 AS SortOrder, 'F1' AS FragmentId, 'm1: Hanoi and TB >= 8' AS Minterm, COUNT(*) AS RowsInFragment FROM dbo.Fragment_1
    UNION ALL SELECT 2, 'F2', 'm2: Hanoi and TB < 8', COUNT(*) FROM dbo.Fragment_2
    UNION ALL SELECT 3, 'F3', 'm3: outside Hanoi and TB >= 8', COUNT(*) FROM dbo.Fragment_3
    UNION ALL SELECT 4, 'F4', 'm4: outside Hanoi and TB < 8', COUNT(*) FROM dbo.Fragment_4
) AS Counts
ORDER BY SortOrder;
GO

-- Result 2: exact reconstruction and disjointness counts.
;WITH AllFragments AS
(
    SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_1
    UNION ALL SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_2
    UNION ALL SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_3
    UNION ALL SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.Fragment_4
)
SELECT (SELECT COUNT(*) FROM dbo.QLSV) AS SourceRows,
       (SELECT COUNT(*) FROM AllFragments) AS FragmentRows,
       (SELECT COUNT(*) FROM
          (SELECT MA FROM AllFragments GROUP BY MA HAVING COUNT(*) > 1) AS D) AS DuplicateStudentIds,
       (SELECT COUNT(*) FROM
          (SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV
           EXCEPT SELECT MA, HT, QQ, NS, GT, DT, TB FROM AllFragments) AS Missing) AS MissingRows,
       (SELECT COUNT(*) FROM
          (SELECT MA, HT, QQ, NS, GT, DT, TB FROM AllFragments
           EXCEPT SELECT MA, HT, QQ, NS, GT, DT, TB FROM dbo.QLSV) AS Extra) AS ExtraRows;
GO
