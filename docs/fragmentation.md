# Phase 8 — Horizontal fragmentation

## Mục tiêu và vị trí thực hiện

Tạo các phân mảnh ngang theo minterm Phase 7 trên Máy 1, database
QLSV_SITE1. Input là dbo.QLSV với 60 bản ghi và tập predicate
{QQ = N'Hà Nội', TB >= 8}.

Trong giai đoạn thiết kế, bốn fragment được dựng tạm cùng database Site 1
để kiểm chứng điều kiện, tính phủ đủ và không giao nhau. Đây là staging
trước phân bổ: Site 2 chưa cần online và chưa có Linked Server. Phase 9
phân bổ F1/F2 cho Site 1, F3/F4 cho Site 2 theo thiết kế đang được dùng.
Ở trạng thái cuối mỗi site chỉ giữ các hàng của fragment đã phân bổ.
Bảng nguồn đầy đủ tại Site 1 chỉ phục vụ thiết kế và kiểm tra trước khi
chuyển sang cấu trúc vật lý cuối cùng.

## Định nghĩa

| Bảng | Minterm | Điều kiện |
|---|---|---|
| dbo.Fragment_1 | m1 = p1 AND p2 | QQ = N'Hà Nội' AND TB >= 8 |
| dbo.Fragment_2 | m2 = p1 AND NOT p2 | QQ = N'Hà Nội' AND TB < 8 |
| dbo.Fragment_3 | m3 = NOT p1 AND p2 | QQ <> N'Hà Nội' AND TB >= 8 |
| dbo.Fragment_4 | m4 = NOT p1 AND NOT p2 | QQ <> N'Hà Nội' AND TB < 8 |

Mỗi bảng có cùng bảy cột, cùng kiểu dữ liệu và khóa chính MA. Check
constraint trên từng bảng cưỡng chế đúng minterm, ngoài điều kiện lọc lúc nạp.

## File và thứ tự chạy

1. database/site1/10_fragments.sql tạo bốn bảng rỗng và khóa chính.
2. database/site1/11_fragment_constraints.sql thêm CHECK, nạp fragment
   từ dbo.QLSV trong transaction và xác minh phân hoạch.

Chạy nguyên file trong SSMS. Các script có lệnh USE QLSV_SITE1. Nếu script 11
gặp lỗi trong transaction, thay đổi nạp dữ liệu được rollback; thông báo lỗi
chỉ ra phép kiểm tra thất bại. Check constraint được thêm trước transaction
để ngăn bản ghi sai trong các lần nạp sau.

Script 11 có thể chạy lại: nó làm mới đúng bốn bảng fragment từ bảng nguồn;
nó không xóa hay sửa dbo.QLSV. Chạy sau khi đã xác nhận bảng nguồn và
constraints Phase 3.

## Kết quả mong đợi với seed hiện tại

| Fragment | Số dòng |
|---|---:|
| F1 | 0 |
| F2 | 10 |
| F3 | 25 |
| F4 | 25 |
| Tổng | 60 |

Kết quả kiểm tra reconstruction phải cho SourceRows = FragmentRows = 60,
DuplicateStudentIds = 0, MissingRows = 0, ExtraRows = 0.
F1 đang rỗng do seed không có sinh viên Hà Nội đạt 8 điểm. F1 vẫn được
tạo với CHECK constraint; bảng rỗng chưa kiểm chứng đường nạp dữ liệu
thực tế cho nhóm này. Trước integration test cần dữ liệu phủ cả bốn nhóm.

## Vì sao đây là phân mảnh ngang

Mỗi fragment giữ nguyên toàn bộ thuộc tính của QLSV và chỉ chứa một tập
con các bộ được chọn bởi minterm. Không có cột nào bị loại. Bốn minterm
loại trừ lẫn nhau và phủ mọi bộ vì QQ/TB NOT NULL và các điều kiện p1/NOT p1,
p2/NOT p2 tạo các cặp bù nhau.

Kết quả reconstruction trên cùng SQL Server xác minh định nghĩa và dữ liệu
fragment; nó chưa chứng minh truy vấn phân tán thật. Linked Server và
distributed query thuộc các phase sau.

## Lỗi thường gặp và điều kiện hoàn thành

- Lỗi CHECK khi thêm constraint: bảng fragment có dữ liệu cũ không thỏa
  minterm; xem lại dữ liệu và điều kiện trước khi tiếp tục.
- MissingRows hoặc ExtraRows khác 0: dừng, chưa chuyển sang allocation.
- DuplicateStudentIds khác 0: tìm MA xuất hiện ở nhiều bảng trước khi tiếp tục.
- Không tạo được bảng: xác nhận đang dùng QLSV_SITE1 và tài khoản được phép
  tạo bảng, constraint và ghi dữ liệu.
- IntelliSense báo lỗi nhưng Execute thành công: đối chiếu Results/Messages;
  IntelliSense không phải kết quả thực thi SQL Server.

Phase 8 đạt khi có bốn fragment, số dòng đối chiếu được, duplicate, missing
và extra đều bằng 0, và đã xác nhận các bảng đang staging trên Site 1.
Sau xác nhận mới làm Phase 9 — Fragment Allocation.
