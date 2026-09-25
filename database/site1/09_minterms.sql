/*
    PHASE 7 - Minterms from the final set {p1, p2}.
    p1: QQ = N'Hà Nội'; p2: TB >= 8.
    Read-only with respect to persistent tables. Run the entire file.
    Definitions and proofs: docs/minterms.md.
*/
USE QLSV_SITE1;
GO

SET NOCOUNT ON;

DECLARE @Minterms TABLE
(
    MintermId VARCHAR(2) PRIMARY KEY,
    P1 INT NOT NULL,
    P2 INT NOT NULL,
    SqlCondition NVARCHAR(100) NOT NULL
);
INSERT INTO @Minterms (MintermId, P1, P2, SqlCondition)
VALUES
    ('m1', 1, 1, N'QQ = N''Hà Nội'' AND TB >= 8'),
    ('m2', 1, 0, N'QQ = N''Hà Nội'' AND TB < 8'),
    ('m3', 0, 1, N'QQ <> N''Hà Nội'' AND TB >= 8'),
    ('m4', 0, 0, N'QQ <> N''Hà Nội'' AND TB < 8');

DECLARE @Membership TABLE
(
    MA VARCHAR(20) PRIMARY KEY,
    M1 INT NOT NULL,
    M2 INT NOT NULL,
    M3 INT NOT NULL,
    M4 INT NOT NULL
);
-- Evaluate every minterm independently. An ELSE catch-all must not hide gaps.
INSERT INTO @Membership (MA, M1, M2, M3, M4)
SELECT MA,
    CASE WHEN QQ = N'Hà Nội' AND TB >= 8 THEN 1 ELSE 0 END,
    CASE WHEN QQ = N'Hà Nội' AND TB < 8 THEN 1 ELSE 0 END,
    CASE WHEN QQ <> N'Hà Nội' AND TB >= 8 THEN 1 ELSE 0 END,
    CASE WHEN QQ <> N'Hà Nội' AND TB < 8 THEN 1 ELSE 0 END
FROM dbo.QLSV;

-- Result 1: keep all four definitions visible even when a group is empty.
SELECT m.MintermId, m.P1, m.P2, m.SqlCondition,
       COALESCE(SUM(CASE m.MintermId
           WHEN 'm1' THEN s.M1 WHEN 'm2' THEN s.M2
           WHEN 'm3' THEN s.M3 WHEN 'm4' THEN s.M4 END), 0) AS MatchingRows
FROM @Minterms AS m
LEFT JOIN @Membership AS s ON 1 = 1
GROUP BY m.MintermId, m.P1, m.P2, m.SqlCondition
ORDER BY m.MintermId;

-- Result 2: empty source tables produce zeros, not NULL totals.
SELECT COUNT(*) AS TotalStudents,
       COALESCE(SUM(M1 + M2 + M3 + M4), 0) AS TotalMatches,
       COALESCE(SUM(CASE WHEN M1 + M2 + M3 + M4 = 0 THEN 1 ELSE 0 END), 0)
           AS MissingStudents,
       COALESCE(SUM(CASE WHEN M1 + M2 + M3 + M4 > 1 THEN 1 ELSE 0 END), 0)
           AS OverlappingStudents
FROM @Membership;

-- Result 3: expected zero rows; individual MA diagnostics if coverage fails.
SELECT MA, M1, M2, M3, M4, M1 + M2 + M3 + M4 AS MatchCount
FROM @Membership
WHERE M1 + M2 + M3 + M4 <> 1
ORDER BY MA;

-- Result 4: independent expected answers at valid score boundaries.
-- These examples do not insert any rows into dbo.QLSV.
DECLARE @BoundaryCases TABLE
(
    CaseId INT PRIMARY KEY,
    QQ NVARCHAR(100) NOT NULL,
    TB DECIMAL(4,2) NOT NULL,
    ExpectedMinterm VARCHAR(2) NOT NULL
);
INSERT INTO @BoundaryCases (CaseId, QQ, TB, ExpectedMinterm)
VALUES
    (1, N'Hà Nội', 0.00, 'm2'),
    (2, N'Hà Nội', 5.00, 'm2'),
    (3, N'Hà Nội', 7.99, 'm2'),
    (4, N'Hà Nội', 8.00, 'm1'),
    (5, N'Hà Nội', 10.00, 'm1'),
    (6, N'Đà Nẵng', 0.00, 'm4'),
    (7, N'Đà Nẵng', 5.00, 'm4'),
    (8, N'Đà Nẵng', 7.99, 'm4'),
    (9, N'Đà Nẵng', 8.00, 'm3'),
    (10, N'Đà Nẵng', 10.00, 'm3');

SELECT b.CaseId, b.QQ, b.TB, b.ExpectedMinterm,
       MIN(m.MintermId) AS ActualMinterm,
       COUNT(m.MintermId) AS MatchCount,
       CASE WHEN COUNT(m.MintermId) = 1
                 AND MIN(m.MintermId) = b.ExpectedMinterm
            THEN 'PASS' ELSE 'FAIL' END AS Status
FROM @BoundaryCases AS b
LEFT JOIN @Minterms AS m ON
       (m.MintermId = 'm1' AND b.QQ = N'Hà Nội' AND b.TB >= 8)
    OR (m.MintermId = 'm2' AND b.QQ = N'Hà Nội' AND b.TB < 8)
    OR (m.MintermId = 'm3' AND b.QQ <> N'Hà Nội' AND b.TB >= 8)
    OR (m.MintermId = 'm4' AND b.QQ <> N'Hà Nội' AND b.TB < 8)
GROUP BY b.CaseId, b.QQ, b.TB, b.ExpectedMinterm
ORDER BY b.CaseId;
GO
