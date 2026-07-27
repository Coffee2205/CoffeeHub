# Known Limitations

- Chưa có database, authentication hoặc feature application; các phần này thuộc task sau.
- Bootstrap mới chỉ có trang nền tảng tối thiểu, chưa phải giao diện sản phẩm hoàn chỉnh.
- `npm audit --omit=dev` hiện báo 3 advisory mức high trong dependency bắc cầu `postcss`/`sharp` của Next.js 16.2.12. npm chỉ đề xuất downgrade phá vỡ xuống Next.js 9, nên chưa tự áp dụng; cần theo dõi bản vá Next.js tương thích.
