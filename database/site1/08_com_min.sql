/*
    PHASE 6 - COM_MIN walkthrough for the assumed workload.
    Read-only with respect to dbo.QLSV; model rows are batch-local.
    This verifies a finite truth-class model, not arbitrary SQL workloads.
    See docs/com-min.md for the completeness and minimality argument.
*/
USE QLSV_SITE1;
GO

DECLARE @Model TABLE
(
    PredicateMask INT NOT NULL,
    AccessPattern INT NOT NULL,
    App1Reads INT NOT NULL,
    App2Reads INT NOT NULL
);

-- Bit weights: p1=1, p2=2, p3=4, p4=8, p5=16, p6=32, p7=64.
-- These 48 representatives cover all feasible candidate truth patterns.
INSERT INTO @Model (PredicateMask, AccessPattern, App1Reads, App2Reads)
SELECT
    CASE WHEN q.QQ = N'Hà Nội' THEN 1 ELSE 0 END
    + CASE WHEN t.TB >= 8 THEN 2 ELSE 4 END
    + CASE WHEN q.QQ = N'TP. Hồ Chí Minh' THEN 8 ELSE 0 END
    + CASE WHEN g.GT = N'Nam' THEN 16 ELSE 0 END
    + CASE WHEN y.NS >= 2005 THEN 32 ELSE 0 END
    + CASE WHEN d.DT = N'Kinh' THEN 64 ELSE 0 END,
    w.QueryId, w.App1Frequency + 2, w.App2Frequency + 2
FROM (VALUES (N'Hà Nội'), (N'TP. Hồ Chí Minh'), (N'Đà Nẵng')) AS q(QQ)
CROSS JOIN (VALUES (7.00), (8.00)) AS t(TB)
CROSS JOIN (VALUES (N'Nam'), (N'Nữ')) AS g(GT)
CROSS JOIN (VALUES (2004), (2005)) AS y(NS)
CROSS JOIN (VALUES (N'Kinh'), (N'Tày')) AS d(DT)
JOIN (VALUES (1, 40, 5), (2, 20, 5), (3, 5, 40), (4, 5, 20))
    AS w(QueryId, App1Frequency, App2Frequency)
    ON w.QueryId = CASE
        WHEN q.QQ = N'Hà Nội' AND t.TB >= 8 THEN 1
        WHEN q.QQ = N'Hà Nội' AND t.TB < 8 THEN 2
        WHEN q.QQ <> N'Hà Nội' AND t.TB >= 8 THEN 3
        ELSE 4 END;

-- A class is mixed if its members are read by different query patterns.
-- Query patterns have different application access vectors in this model.
;WITH Partitions AS
(
    SELECT c.StepNo, c.CandidateSet,
           m.PredicateMask & c.SelectedMask AS ClassSignature,
           COUNT(DISTINCT m.AccessPattern) AS DistinctAccessPatterns
    FROM @Model AS m
    CROSS JOIN (VALUES
        (1, N'Empty', 0),
        (2, N'p1 only / remove p2', 1),
        (3, N'p2 only / remove p1', 2),
        (4, N'p1, p2 (FINAL)', 3),
        (5, N'p1, p2, p3', 7),
        (6, N'p1, p2, p4', 11),
        (7, N'p1, p2, p5', 19),
        (8, N'p1, p2, p6', 35),
        (9, N'p1, p2, p7', 67)
    ) AS c(StepNo, CandidateSet, SelectedMask)
    GROUP BY c.StepNo, c.CandidateSet, m.PredicateMask & c.SelectedMask
)
SELECT CandidateSet, COUNT(*) AS ClassCount,
       SUM(CASE WHEN DistinctAccessPatterns > 1 THEN 1 ELSE 0 END) AS MixedClasses,
       CASE WHEN MAX(DistinctAccessPatterns) = 1
            THEN 'COMPLETE FOR MODEL' ELSE 'INCOMPLETE' END AS Assessment
FROM Partitions
GROUP BY StepNo, CandidateSet
ORDER BY StepNo;

-- Include classes with no actual rows, such as Hanoi with TB >= 8.
;WITH Profiles AS
(
    SELECT DISTINCT AccessPattern, App1Reads, App2Reads FROM @Model
), ActualCounts AS
(
    SELECT CASE
        WHEN QQ = N'Hà Nội' AND TB >= 8 THEN 1
        WHEN QQ = N'Hà Nội' AND TB < 8 THEN 2
        WHEN QQ <> N'Hà Nội' AND TB >= 8 THEN 3
        ELSE 4 END AS AccessPattern,
        COUNT(*) AS ActualRows
    FROM dbo.QLSV
    GROUP BY CASE
        WHEN QQ = N'Hà Nội' AND TB >= 8 THEN 1
        WHEN QQ = N'Hà Nội' AND TB < 8 THEN 2
        WHEN QQ <> N'Hà Nội' AND TB >= 8 THEN 3
        ELSE 4 END
)
SELECT p.AccessPattern AS QueryId, p.App1Reads, p.App2Reads,
       COALESCE(a.ActualRows, 0) AS ActualRows
FROM Profiles AS p
LEFT JOIN ActualCounts AS a ON a.AccessPattern = p.AccessPattern
ORDER BY p.AccessPattern;

SELECT COUNT(*) AS ComplementViolations
FROM dbo.QLSV
WHERE TB IS NULL
   OR (CASE WHEN TB >= 8 THEN 1 ELSE 0 END
       + CASE WHEN TB < 8 THEN 1 ELSE 0 END) <> 1;
GO
