# Phase 5 — Workload và simple predicates

## Mục tiêu và phạm vi

Xác định các điều kiện truy vấn ứng viên cho quan hệ
`QLSV(MA, HT, QQ, NS, GT, DT, TB)` trước khi thực hiện COM_MIN.
Thực hiện trên Máy 1, database `QLSV_SITE1`, bảng nguồn `dbo.QLSV`.

File SQL: `database/site1/07_predicates.sql`. Script chỉ đọc dữ liệu.
Chưa chọn final predicate set; kết luận đầy đủ và tối thiểu thuộc Phase 6.

## Workload giả định

**Đây là giả định thiết kế, không phải nội dung đề bài.** Hai ứng dụng
cùng quản lý sinh viên nhưng có nhóm phục vụ khác nhau:

- Application 1 thường tra cứu sinh viên có quê quán Hà Nội.
- Application 2 thường tra cứu sinh viên có quê quán khác Hà Nội.
- Mỗi ứng dụng cần danh sách đạt từ 8 điểm và danh sách dưới 8 điểm.
- Ngưỡng 8 là giả định nghiệp vụ cho bản demo, không phải quy định học bổng.
- Cả hai có thể xem toàn bộ sinh viên khi cần báo cáo tổng hợp.

Quê quán không quyết định vị trí vật lý của máy chủ. Phân bổ fragment
sẽ được thiết kế ở Phase 9 dựa trên workload này.

| Query | Điều kiện WHERE | Application 1: lượt/ngày | Application 2: lượt/ngày |
|---|---|---:|---:|
| Q1 | `QQ = N'Hà Nội' AND TB >= 8` | 40 | 5 |
| Q2 | `QQ = N'Hà Nội' AND TB < 8` | 20 | 5 |
| Q3 | `QQ <> N'Hà Nội' AND TB >= 8` | 5 | 40 |
| Q4 | `QQ <> N'Hà Nội' AND TB < 8` | 5 | 20 |
| Q5 | Không lọc, báo cáo toàn bộ | 2 | 2 |

Tất cả tần suất là **giả định**, không phải số liệu đo từ ứng dụng.
Trong mỗi truy vấn lọc, mọi bản ghi thỏa điều kiện được đọc; không giả định
ưu tiên theo MA, giới tính, năm sinh hoặc dân tộc bên trong nhóm đó.
Q5 truy cập đồng đều toàn bộ quan hệ nên không bổ sung điều kiện phân chia.

## Predicate là gì?

Predicate là điều kiện nhận giá trị đúng hoặc sai đối với một bản ghi.
Simple predicate ở đây so sánh một thuộc tính với một hằng số,
ví dụ `TB >= 8`. Q1 kết hợp hai simple predicates bằng `AND`.
Các cột QQ và TB đều NOT NULL nên các phép so sánh này không gặp UNKNOWN
do NULL; điều này quan trọng khi dùng phủ định để chia nhóm.

## Candidate predicate set

| ID | Điều kiện | Liên hệ với workload | Nhận xét để xét trong Phase 6 |
|---|---|---|---|
| p1 | `QQ = N'Hà Nội'` | Q1–Q2 dùng trực tiếp; Q3–Q4 dùng phủ định | Phân biệt nhóm phục vụ của hai ứng dụng |
| p2 | `TB >= 8` | Q1, Q3 | Phân biệt nhóm điểm cao với nhóm còn lại |
| p3 | `TB < 8` | Q2, Q4 | Là phủ định của p2 vì TB NOT NULL; cần xét dư thừa |
| p4 | `QQ = N'TP. Hồ Chí Minh'` | Không query nào lọc riêng TP. Hồ Chí Minh | Chia nhỏ nhóm ngoài Hà Nội nhưng chưa có nhu cầu truy cập riêng |
| p5 | `GT = N'Nam'` | Không query nào lọc theo giới tính | Chưa có căn cứ workload để dùng phân mảnh |
| p6 | `NS >= 2005` | Không query nào lọc theo năm sinh | Ngưỡng minh họa để xem xét ứng viên; chưa có căn cứ workload |
| p7 | `DT = N'Kinh'` | Không query nào lọc theo dân tộc | Chưa có căn cứ workload để dùng phân mảnh |

Candidate set hiện tại là `{p1, p2, p3, p4, p5, p6, p7}`.
Các ứng viên p4–p7 được đưa vào để đánh giá có lý do; việc một thuộc tính
tồn tại trong bảng hoặc chia dữ liệu thành hai nhóm không tự chứng minh
rằng predicate đó cần thiết cho workload.

**Final predicate set chưa được chốt.** Phase 6 phải phân tích completeness,
partition và relevance trước khi loại ứng viên hoặc kết luận tối thiểu.
Số dòng thỏa predicate chỉ minh họa dữ liệu hiện tại, không phải chứng minh COM_MIN.

## Chạy và kiểm tra

Trong SSMS, kết nối Site 1 và mở `database/site1/07_predicates.sql`, rồi Execute.
Script trả về ba nhóm kết quả: thống kê ứng viên, thống kê workload và
danh sách chi tiết Q1 để minh họa cách ghép điều kiện.

Với đúng bộ 60 dòng do Phase 4 tạo, chưa có dữ liệu khác:

| Predicate | Số dòng thỏa | Số dòng không thỏa |
|---|---:|---:|
| p1 | 10 | 50 |
| p2 | 25 | 35 |
| p3 | 35 | 25 |
| p4 | 10 | 50 |
| p5 | 20 | 40 |
| p6 | 30 | 30 |
| p7 | 12 | 48 |

Q1 = 0, Q2 = 10, Q3 = 25, Q4 = 25 và Q5 = 60 dòng.
Mỗi hàng thống kê predicate phải có tổng số dòng thỏa và không thỏa bằng 60.
Nếu dữ liệu đã thay đổi, số đếm có thể khác.

**Giới hạn dữ liệu mẫu:** cách sinh dữ liệu Phase 4 gắn Hà Nội với các điểm
0 và 4.25, nên Q1 hiện rỗng. `QQ = N'Hà Nội' AND TB >= 8` vẫn hợp lệ theo
schema. Không được loại một nhóm hợp lệ chỉ vì hiện chưa có bản ghi.
Trước khi kiểm thử phân mảnh về sau, cần bổ sung dữ liệu phủ nhóm này.

## Lỗi thường gặp và điều kiện hoàn thành

- Nếu báo không tìm thấy bảng, kiểm tra kết nối đúng instance và database
  `QLSV_SITE1`, đồng thời xác nhận Phase 3 đã chạy.
- Dùng chuỗi Unicode có tiền tố `N`, và giữ đúng cách viết quê quán trong seed.
- Q1 không có dòng là kết quả dự kiến trên bộ seed hiện tại.
- Nếu chỉ Error List báo lỗi trong khi Messages báo thành công, kiểm tra lại
  metadata của trình soạn thảo; lấy kết quả thực thi làm căn cứ.

Phase 5 hoàn thành khi script chạy thành công, số đếm được đối chiếu,
workload được ghi rõ là giả định và candidate set được phân biệt với final set.
Sau đó mới sang Phase 6 — COM_MIN.
