# Development Accounts

## Production account model

CoffeeHub production dùng một tài khoản owner/admin.

- Khách xem CV công khai mà không đăng nhập.
- Không có guest account.
- Không có public signup.
- Owner account dùng email/password Supabase Auth.
- Owner role lấy từ `app_metadata.role`.

## Development/test accounts

Có thể tạo tạm:

### Owner/Admin

```env
E2E_ADMIN_EMAIL="development-admin@example.test"
E2E_ADMIN_PASSWORD=""
```

Dùng để test:

- `/app/*`.
- `/admin/*`.
- publish nội dung.
- chỉnh CV.
- quản lý workspace.

### Non-admin test user

Chỉ tạo khi cần test authorization denial:

```env
E2E_USER_EMAIL="development-user@example.test"
E2E_USER_PASSWORD=""
```

Đây không phải guest account và không xuất hiện trong production UX.

## Browser test matrix

1. Anonymous mở `/` và xem toàn bộ CV đã publish.
2. Anonymous mở project/post detail đã publish.
3. Anonymous mở `/app/dashboard` → `/login`.
4. Anonymous mở `/admin` → `/login`.
5. Owner đăng nhập → `/app/dashboard`.
6. Owner mở toàn bộ app routes.
7. Owner mở `/admin`, chỉnh và publish CV.
8. Anonymous thấy thay đổi đã publish.
9. Non-admin test user không vào `/admin`.
10. Logout owner → `/`.

Không commit password hoặc credential thật.
