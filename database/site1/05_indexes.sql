/*
    PHASE 3 - Index verification

    The primary key creates the MA index. Additional indexes are deferred
    until the application workload and predicate analysis are defined.
*/

USE QLSV_SITE1;
GO

SELECT
    i.name      AS IndexName,
    i.type_desc AS IndexType,
    i.is_unique AS IsUnique
FROM sys.indexes AS i
WHERE i.object_id = OBJECT_ID(N'dbo.QLSV')
  AND i.name IS NOT NULL
ORDER BY i.index_id;
GO
