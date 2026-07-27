# Issues

## Dependency advisories

- Trạng thái: Open, không chặn bootstrap local.
- `npm audit`: 12 high (bao gồm toolchain phát triển).
- `npm audit --omit=dev`: 3 high từ `postcss` và `sharp` qua Next.js 16.2.12.
- Hành động đã tránh: không chạy `npm audit fix --force` vì npm đề xuất downgrade phá vỡ xuống Next.js 9.3.3.
- Bước tiếp theo: kiểm tra lại khi Next.js phát hành bản stable chứa dependency đã vá.
