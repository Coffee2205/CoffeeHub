import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  SaveStatus,
  Textarea,
} from "@/components/ui";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[var(--content-width)] px-[var(--page-gutter)] py-12 sm:py-16">
      <header className="max-w-3xl">
        <Badge variant="primary">Design foundation</Badge>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
          Midnight Blue Aurora
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-foreground-secondary sm:text-lg">
          Hệ thống giao diện nền tảng cho CoffeeHub: tập trung, rõ ràng và sẵn sàng cho mọi trạng thái dữ liệu.
        </p>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Touch target tối thiểu, focus rõ và trạng thái disabled.</CardDescription>
          </CardHeader>
          <div className="flex flex-wrap gap-3">
            <Button>Tạo mục tiêu</Button>
            <Button variant="secondary">Xem kế hoạch</Button>
            <Button variant="ghost">Bỏ qua</Button>
            <Button variant="danger">Xóa bản nháp</Button>
          </div>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-foreground-secondary">
              Tên mục tiêu
              <Input placeholder="Ví dụ: Hoàn thành portfolio" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground-secondary">
              Ghi chú
              <Textarea placeholder="Mô tả kết quả bạn muốn đạt được..." />
            </label>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status language</CardTitle>
            <CardDescription>Màu sắc luôn đi cùng nhãn văn bản có thể đọc được.</CardDescription>
          </CardHeader>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <SaveStatus state="saving" />
            <SaveStatus state="saved" />
            <SaveStatus state="failed" />
            <SaveStatus state="offline" />
            <SaveStatus state="syncing" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>Draft</Badge>
            <Badge variant="success">Hoàn thành</Badge>
            <Badge variant="warning">Sắp đến hạn</Badge>
            <Badge variant="error">Cần xử lý</Badge>
          </div>
          <div className="mt-8 rounded-md border border-border bg-background-secondary/70 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Typography</p>
            <p className="mt-2 text-xl font-semibold tracking-[-0.025em]">Geist Sans cho giao diện</p>
            <p className="mt-2 [font-family:var(--font-geist-mono)] text-xs text-info tabular-nums">
              progress: 68% · updated: 14:32
            </p>
          </div>
        </Card>
      </div>

      <section className="mt-5 grid gap-5 md:grid-cols-3" aria-label="Trạng thái dữ liệu nền tảng">
        <LoadingState />
        <EmptyState action={<Button size="sm">Tạo nội dung</Button>} />
        <ErrorState action={<Button size="sm" variant="secondary">Thử lại</Button>} />
      </section>
    </main>
  );
}
