/*
    Site 2 - Test tái tạo/đủ/không giao nhau (Phase 8-9).
    Chạy trên QLSV_SITE2. Chỉ SELECT.
    Yêu cầu: F3/F4 local đã có dữ liệu, SITE1_SQL thông,
    qlsv_link được SELECT QLSV + Fragment_1/2 bên Site 1.
    Kết quả đúng: tái tạo 60, thiếu 0, thừa 0, giao nhau 0.
    Lưu ý: EXCEPT + UNION ALL phải bọc ngoặc, nếu không sai số.
*/
USE QLSV_SITE2;
GO

SELECT COUNT(*) AS Reconstructed FROM (
    SELECT MA FROM dbo.Fragment_3
    UNION ALL SELECT MA FROM dbo.Fragment_4
    UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1]
    UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2]
) AS t;
GO

SELECT MA, COUNT(*) AS C FROM (
    SELECT MA FROM dbo.Fragment_3
    UNION ALL SELECT MA FROM dbo.Fragment_4
    UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1]
    UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2]
) AS t
GROUP BY MA
HAVING COUNT(*) > 1;
GO

SELECT COUNT(*) AS Missing FROM (
    SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[QLSV]
    EXCEPT
    (SELECT MA FROM dbo.Fragment_3
     UNION ALL SELECT MA FROM dbo.Fragment_4
     UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1]
     UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2])
) AS m;
GO

SELECT COUNT(*) AS Extra FROM (
    (SELECT MA FROM dbo.Fragment_3
     UNION ALL SELECT MA FROM dbo.Fragment_4
     UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1]
     UNION ALL SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2])
    EXCEPT
    SELECT MA FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[QLSV]
) AS e;
GO

SELECT COUNT(*) AS F3_F4 FROM dbo.Fragment_3 AS a JOIN dbo.Fragment_4 AS b ON a.MA = b.MA;
GO
SELECT COUNT(*) AS F3_F1 FROM dbo.Fragment_3 AS a JOIN [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1] AS b ON a.MA = b.MA;
GO
SELECT COUNT(*) AS F3_F2 FROM dbo.Fragment_3 AS a JOIN [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2] AS b ON a.MA = b.MA;
GO
SELECT COUNT(*) AS F4_F1 FROM dbo.Fragment_4 AS a JOIN [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1] AS b ON a.MA = b.MA;
GO
SELECT COUNT(*) AS F4_F2 FROM dbo.Fragment_4 AS a JOIN [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2] AS b ON a.MA = b.MA;
GO
SELECT COUNT(*) AS F1_F2
FROM [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_1] AS a
JOIN [SITE1_SQL].[QLSV_SITE1].[dbo].[Fragment_2] AS b ON a.MA = b.MA;
GO

SELECT COUNT(*) AS F3_bad FROM dbo.Fragment_3 WHERE NOT (QQ <> N'Hà Nội' AND TB >= 8);
GO
SELECT COUNT(*) AS F4_bad FROM dbo.Fragment_4 WHERE NOT (QQ <> N'Hà Nội' AND TB < 8);
GO
