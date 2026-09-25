/*
    PHASE 5 - Candidate simple predicates
    Site 1; read-only illustration of the assumed workload.
    See docs/predicates.md. Final predicate selection belongs to Phase 6.
*/

USE QLSV_SITE1;
GO

-- NOT NULL columns ensure that each candidate is either true or false.
-- Aggregates also return seven rows when the source table is empty.
SELECT
    p.PredicateId,
    p.PredicateText,
    COUNT(s.MA) AS TotalRows,
    COALESCE(SUM(CASE p.PredicateId
        WHEN 'p1' THEN CASE WHEN s.QQ = N'Hà Nội' THEN 1 ELSE 0 END
        WHEN 'p2' THEN CASE WHEN s.TB >= 8 THEN 1 ELSE 0 END
        WHEN 'p3' THEN CASE WHEN s.TB < 8 THEN 1 ELSE 0 END
        WHEN 'p4' THEN CASE WHEN s.QQ = N'TP. Hồ Chí Minh' THEN 1 ELSE 0 END
        WHEN 'p5' THEN CASE WHEN s.GT = N'Nam' THEN 1 ELSE 0 END
        WHEN 'p6' THEN CASE WHEN s.NS >= 2005 THEN 1 ELSE 0 END
        WHEN 'p7' THEN CASE WHEN s.DT = N'Kinh' THEN 1 ELSE 0 END
    END), 0) AS MatchingRows,
    COUNT(s.MA) - COALESCE(SUM(CASE p.PredicateId
        WHEN 'p1' THEN CASE WHEN s.QQ = N'Hà Nội' THEN 1 ELSE 0 END
        WHEN 'p2' THEN CASE WHEN s.TB >= 8 THEN 1 ELSE 0 END
        WHEN 'p3' THEN CASE WHEN s.TB < 8 THEN 1 ELSE 0 END
        WHEN 'p4' THEN CASE WHEN s.QQ = N'TP. Hồ Chí Minh' THEN 1 ELSE 0 END
        WHEN 'p5' THEN CASE WHEN s.GT = N'Nam' THEN 1 ELSE 0 END
        WHEN 'p6' THEN CASE WHEN s.NS >= 2005 THEN 1 ELSE 0 END
        WHEN 'p7' THEN CASE WHEN s.DT = N'Kinh' THEN 1 ELSE 0 END
    END), 0) AS NonMatchingRows
FROM (VALUES
    ('p1', N'QQ = N''Hà Nội'''),
    ('p2', N'TB >= 8'),
    ('p3', N'TB < 8'),
    ('p4', N'QQ = N''TP. Hồ Chí Minh'''),
    ('p5', N'GT = N''Nam'''),
    ('p6', N'NS >= 2005'),
    ('p7', N'DT = N''Kinh''')
) AS p(PredicateId, PredicateText)
LEFT JOIN dbo.QLSV AS s ON 1 = 1
GROUP BY p.PredicateId, p.PredicateText
ORDER BY p.PredicateId;
GO

-- Query frequencies are assumptions documented in docs/predicates.md.
SELECT 'Q1' AS QueryId, N'Hà Nội, TB >= 8' AS QueryDescription,
       COUNT(*) AS MatchingRows
FROM dbo.QLSV WHERE QQ = N'Hà Nội' AND TB >= 8
UNION ALL
SELECT 'Q2', N'Hà Nội, TB < 8', COUNT(*)
FROM dbo.QLSV WHERE QQ = N'Hà Nội' AND TB < 8
UNION ALL
SELECT 'Q3', N'Ngoài Hà Nội, TB >= 8', COUNT(*)
FROM dbo.QLSV WHERE QQ <> N'Hà Nội' AND TB >= 8
UNION ALL
SELECT 'Q4', N'Ngoài Hà Nội, TB < 8', COUNT(*)
FROM dbo.QLSV WHERE QQ <> N'Hà Nội' AND TB < 8
UNION ALL
SELECT 'Q5', N'Toàn bộ sinh viên', COUNT(*) FROM dbo.QLSV
ORDER BY QueryId;
GO

-- Q1 returns zero rows with the Phase 4 seed. This is a coverage gap,
-- not a contradiction: the schema permits Hanoi students with TB >= 8.
SELECT MA, HT, QQ, NS, GT, DT, TB
FROM dbo.QLSV
WHERE QQ = N'Hà Nội' AND TB >= 8
ORDER BY MA;
GO
