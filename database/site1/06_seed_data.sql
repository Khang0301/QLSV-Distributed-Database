/*
    PHASE 4 - Deterministic test data for Site 1

    Creates 60 sample students. The TEST IDs make the script safe to rerun:
    existing IDs are left unchanged, and only missing rows are inserted.

    Coverage includes score boundaries 0.00, 5.00, 8.00, and 10.00,
    multiple hometowns, birth years, genders, and ethnicities.
*/

USE QLSV_SITE1;
GO

IF OBJECT_ID(N'dbo.QLSV', N'U') IS NULL
    THROW 50002, 'dbo.QLSV must exist before test data is inserted.', 1;
GO

;WITH Numbers AS
(
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1
    FROM Numbers
    WHERE n < 60
),
SampleRows AS
(
    SELECT
        CONCAT('TST', RIGHT(CONCAT('000', CONVERT(VARCHAR(3), n)), 3)) AS MA,
        CONCAT(N'Sinh viên ', CONVERT(NVARCHAR(3), n)) AS HT,
        CASE n % 6
            WHEN 0 THEN N'Hà Nội'
            WHEN 1 THEN N'TP. Hồ Chí Minh'
            WHEN 2 THEN N'Đà Nẵng'
            WHEN 3 THEN N'Cần Thơ'
            WHEN 4 THEN N'Hải Phòng'
            ELSE N'Nghệ An'
        END AS QQ,
        CONVERT(SMALLINT, 2000 + (n % 10)) AS NS,
        CASE n % 3
            WHEN 0 THEN N'Nam'
            WHEN 1 THEN N'Nữ'
            ELSE N'Khác'
        END AS GT,
        CASE n % 5
            WHEN 0 THEN N'Kinh'
            WHEN 1 THEN N'Tày'
            WHEN 2 THEN N'Thái'
            WHEN 3 THEN N'Mường'
            ELSE N'Khmer'
        END AS DT,
        CONVERT(DECIMAL(4,2),
            CASE n % 12
                WHEN 0 THEN 0.00
                WHEN 1 THEN 5.00
                WHEN 2 THEN 8.00
                WHEN 3 THEN 10.00
                WHEN 4 THEN 2.50
                WHEN 5 THEN 3.75
                WHEN 6 THEN 4.25
                WHEN 7 THEN 6.50
                WHEN 8 THEN 7.25
                WHEN 9 THEN 8.50
                WHEN 10 THEN 9.25
                ELSE 9.75
            END) AS TB
    FROM Numbers
)
INSERT INTO dbo.QLSV (MA, HT, QQ, NS, GT, DT, TB)
SELECT s.MA, s.HT, s.QQ, s.NS, s.GT, s.DT, s.TB
FROM SampleRows AS s
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.QLSV AS existing
    WHERE existing.MA = s.MA
)
OPTION (MAXRECURSION 60);
GO

SELECT
    COUNT(*) AS TotalTestRows,
    SUM(CASE WHEN TB = 0.00 THEN 1 ELSE 0 END) AS RowsWithScore0,
    SUM(CASE WHEN TB = 5.00 THEN 1 ELSE 0 END) AS RowsWithScore5,
    SUM(CASE WHEN TB = 8.00 THEN 1 ELSE 0 END) AS RowsWithScore8,
    SUM(CASE WHEN TB = 10.00 THEN 1 ELSE 0 END) AS RowsWithScore10,
    COUNT(DISTINCT QQ) AS DistinctHometowns,
    COUNT(DISTINCT GT) AS DistinctGenders,
    COUNT(DISTINCT DT) AS DistinctEthnicities,
    MIN(NS) AS EarliestBirthYear,
    MAX(NS) AS LatestBirthYear
FROM dbo.QLSV
WHERE MA LIKE 'TST%';
GO
