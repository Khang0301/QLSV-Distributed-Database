/*
    PHASE 3 - Schema setup
    The project uses dbo for the logical relation and its later fragments.
*/

USE QLSV_SITE1;
GO

SELECT name AS SchemaName
FROM sys.schemas
WHERE name = N'dbo';
GO
