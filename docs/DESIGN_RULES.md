# Quy tắc thiết kế — CoffeeHub

## Định hướng

CoffeeHub sử dụng phong cách dark, hiện đại, tập trung và có chiều sâu.

Concept chính:

> Midnight Blue Aurora

Cảm giác cần truyền tải:

- Tập trung.
- Thông minh.
- Cá nhân.
- Có tổ chức.
- Premium nhưng không phô trương.

## Màu sắc

```text
Background: #050B18
Background secondary: #081225
Background tertiary: #0D1A31
Card: rgba(13, 26, 49, 0.72)
Card border: rgba(148, 163, 184, 0.14)
Primary: #3B82F6
Primary hover: #60A5FA
Primary dark: #2563EB
Cyan accent: #22D3EE
Indigo accent: #6366F1
Purple accent: #8B5CF6
Text primary: #F8FAFC
Text secondary: #CBD5E1
Text muted: #64748B
Success: #22C55E
Warning: #F59E0B
Error: #EF4444
Info: #38BDF8
```

Agent có thể điều chỉnh token để đạt contrast tốt hơn nhưng không được đổi concept tùy tiện.

## Background

Ưu tiên background nhiều lớp:

- Nền navy.
- Radial gradient xanh dương.
- Ánh sáng cyan hoặc indigo nhẹ.
- Grid pattern rất mờ.
- Noise texture nhẹ nếu không ảnh hưởng hiệu năng.

Không dùng ảnh nền chi tiết phía sau mọi trang quản lý.

Ảnh hoặc artwork chỉ nên xuất hiện ở:

- Hero landing page.
- Login page.
- Welcome banner.
- Empty state.
- AI Assistant.

## Typography

Ưu tiên font sans hiện đại và dễ đọc.

Gợi ý:

- Geist Sans.
- Inter.
- Geist Mono cho dữ liệu kỹ thuật.

Quy tắc:

- Heading weight 600–700.
- Body 14–16px.
- Caption không nhỏ hơn mức khó đọc trên mobile.
- Không dùng chữ hoa cho đoạn dài.

## Layout desktop

```text
Sidebar: khoảng 240–256px
Header: khoảng 64–72px
Content max width: tùy màn hình, tối đa khoảng 1440px
Page padding: 24–32px
Card radius: 14–18px
Button radius: 10–12px
```

## Layout mobile

- Header gọn.
- Main content một cột.
- Bottom navigation.
- Không có horizontal scroll.
- Touch target tối thiểu khoảng 44px.
- Dialog dài phải chuyển thành sheet hoặc full-screen phù hợp.

## Card

- Background trong suốt nhẹ.
- Border mờ.
- Shadow thấp.
- Blur vừa phải.
- Chỉ hover card có tương tác.
- Không làm tất cả card phát sáng.

## Trạng thái

Mọi màn hình dữ liệu phải có:

- Loading.
- Empty.
- Error.
- Disabled.
- Saving.
- Saved.
- Offline.
- Syncing khi phù hợp.

## Animation

- Hover: khoảng 150ms.
- Dialog/sheet: khoảng 200ms.
- Page content: fade và translate nhẹ.
- Tôn trọng `prefers-reduced-motion`.
- Không dùng particle dày hoặc animation liên tục gây mất tập trung.

## Accessibility

- Contrast đủ đọc.
- Keyboard navigation.
- Focus visible rõ ràng.
- Label cho form.
- Icon button có accessible name.
- Không dùng màu sắc là tín hiệu duy nhất.

## Không được

- Đổi sang light-first.
- Dùng nhiều màu cạnh tranh với xanh dương.
- Lạm dụng glassmorphism.
- Dùng gradient cho mọi text.
- Tạo UI desktop rồi thu nhỏ máy móc cho mobile.
- Dùng placeholder data như dữ liệu thật trong production.
