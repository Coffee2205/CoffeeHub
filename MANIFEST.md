# CoffeeHub Documentation Manifest

File này xác định nhiệm vụ, nguồn sự thật và liên kết của toàn bộ bộ kit.

## 1. Entry points

| File | Nhiệm vụ | Không chứa |
|---|---|---|
| `README.md` | Hướng dẫn nhanh cho người dùng | Quy tắc triển khai chi tiết |
| `START_AGENT.md` | Prompt ngắn để khởi động agent | Yêu cầu sản phẩm |
| `MANIFEST.md` | Bản đồ tài liệu và trách nhiệm từng file | Trạng thái thực thi |
| `agent/MASTER.md` | Điều phối một phiên làm việc | Chi tiết nghiệp vụ từng feature |

## 2. Agent control

| File | Nhiệm vụ |
|---|---|
| `agent/MASTER.md` | Thứ tự đọc, chọn task, vòng lặp thực thi và mẫu báo cáo |
| `agent/WORKFLOWS.md` | Cách hoạt động của Bootstrap, Development, Maintenance và Release |
| `agent/RULES.md` | Quy tắc code, kiến trúc, bảo mật, database, AI, Git và documentation |
| `agent/STOP_CONDITIONS.md` | Các trường hợp bắt buộc dừng và hỏi người dùng |

`MASTER.md` tham chiếu ba file còn lại. Các file còn lại không điều phối ngược về `MASTER.md`.

## 3. Product and technical documentation

| File | Nguồn sự thật cho |
|---|---|
| `docs/PROJECT_VISION.md` | Định vị và nguyên tắc dài hạn |
| `docs/PRD.md` | Phạm vi sản phẩm và tiêu chí phiên bản đầu |
| `docs/CONTENT_REQUIREMENTS.md` | Nội dung hiển thị và nội dung phải quản trị được |
| `docs/SITE_MAP.md` | Route và navigation |
| `docs/USER_FLOWS.md` | Luồng người dùng |
| `docs/FUNCTIONAL_RULES.md` | Quy tắc nghiệp vụ theo feature |
| `docs/DESIGN_RULES.md` | Visual system, responsive và accessibility |
| `docs/ARCHITECTURE_RULES.md` | Ràng buộc kiến trúc bắt buộc |
| `docs/TECHNICAL_DESIGN.md` | Thiết kế triển khai kỹ thuật |
| `docs/DEPLOYMENT_HANDOFF.md` | Chuẩn bị deploy và bàn giao |
| `docs/REPOSITORY_AUDIT.md` | Ảnh chụp repository đã xác minh; không phải kiến trúc đích |

Phân biệt:

- `ARCHITECTURE_RULES.md` nói **điều bắt buộc phải tuân thủ**.
- `TECHNICAL_DESIGN.md` nói **hệ thống dự kiến được triển khai như thế nào**.
- `PROJECT_VISION.md` nói **tại sao sản phẩm tồn tại**.
- `PRD.md` nói **phiên bản đầu phải có gì**.
- `CONTENT_REQUIREMENTS.md` nói **nội dung nào xuất hiện và nội dung nào người dùng tự chỉnh được**.

## 4. Tasks

| File | Nhiệm vụ |
|---|---|
| `tasks/README.md` | Roadmap, thứ tự và quy tắc trạng thái |
| `tasks/TASK_TEMPLATE.md` | Cấu trúc chuẩn cho task mới |
| `tasks/00-...` đến `tasks/21-...` | Phạm vi và acceptance criteria của từng giai đoạn |

Task file là nguồn sự thật cho **phạm vi phiên hiện tại**, nhưng không được ghi đè PRD hoặc quyết định đã chấp nhận.

Roadmap canonical chỉ có đúng một file cho mỗi số `00`–`21`.

## 5. Project log

| File | Nhiệm vụ |
|---|---|
| `project-log/CURRENT_STATUS.md` | Trạng thái hiện tại đã xác minh |
| `project-log/NEXT_STEPS.md` | Task đề xuất tiếp theo |
| `project-log/DECISIONS.md` | Quyết định lâu dài đã chấp nhận |
| `project-log/AI_MEMORY.md` | Bài học và ràng buộc agent sau phải nhớ |
| `project-log/ISSUES.md` | Lỗi hoặc blocker đang hoạt động |
| `project-log/KNOWN_LIMITATIONS.md` | Giới hạn đã biết nhưng chưa chắc là lỗi |
| `project-log/TECH_DEBT.md` | Thỏa hiệp kỹ thuật cần xử lý sau |
| `project-log/CHANGELOG.md` | Lịch sử thay đổi đã thực hiện |
| `project-log/README.md` | Quy tắc sử dụng project-log |

Không ghi cùng một thông tin vào nhiều file log:

- Blocker hiện tại → `ISSUES.md`
- Giới hạn sản phẩm → `KNOWN_LIMITATIONS.md`
- Khoản nợ kỹ thuật → `TECH_DEBT.md`
- Quyết định đã chốt → `DECISIONS.md`
- Bài học cho agent → `AI_MEMORY.md`
- Kết quả một phiên → `CHANGELOG.md`

## 6. Source-of-truth priority

1. Yêu cầu trực tiếp mới nhất của người dùng
2. `project-log/DECISIONS.md`
3. `docs/PRD.md` và tài liệu chuyên biệt liên quan
4. Acceptance criteria của task hiện tại
5. Code và Git history đã xác minh
6. Suy luận của agent

Mâu thuẫn lớn phải được báo cáo, không tự hòa giải âm thầm.
