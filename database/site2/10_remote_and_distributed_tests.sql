/*
    Site 2 - Test remote/distributed (Phase 6-7).
    Chạy trên QLSV_SITE2. Chỉ SELECT, không sửa dữ liệu.
    Yêu cầu: Linked Server SITE1_SQL tới QLSV_SITE1.
    Kết quả đúng: F1=0, F2=10, F3nguồn=25, F4nguồn=25, local 25/25, total 60.
*/
USE QLSV_SITE2;
GO

IF (SELECT COUNT(*) FROM sys.servers WHERE name = N'SITE1_SQL' AND is_linked = 1) = 0
    THROW 50021, 'Create linked server SITE1_SQL before running remote tests.', 1;
GO

SELECT COUNT(*) AS F1_remote FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1];
GO
SELECT COUNT(*) AS F2_remote FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2];
GO
SELECT COUNT(*) AS F3_src FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_3];
GO
SELECT COUNT(*) AS F4_src FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_4];
GO

SELECT 'F3_local' AS F, COUNT(*) AS Cnt FROM dbo.Fragment_3
UNION ALL SELECT 'F4_local', COUNT(*) FROM dbo.Fragment_4;
GO

SELECT COUNT(*) AS Total_dist FROM (
    SELECT MA FROM dbo.Fragment_3
    UNION ALL SELECT MA FROM dbo.Fragment_4
    UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1]
    UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2]
) AS t;
GO

SELECT Src, COUNT(*) AS Cnt FROM (
    SELECT 'F3-local' AS Src FROM dbo.Fragment_3
    UNION ALL SELECT 'F4-local' FROM dbo.Fragment_4
    UNION ALL SELECT 'F1-remote' FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1]
    UNION ALL SELECT 'F2-remote' FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2]
) AS t
GROUP BY Src
ORDER BY Src;
GO
