import Link from "next/link";
export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="max-w-lg rounded-lg border border-border bg-surface p-7 text-center">
        <p className="text-sm font-semibold text-warning">Ngoại tuyến</p>
        <h1 className="mt-3 text-3xl font-semibold">Không thể tải trang này</h1>
        <p className="mt-3 text-foreground-secondary">
          CoffeeHub không cache response riêng tư, token, signed URL hoặc dữ
          liệu từ phiên trước. Kết nối lại để tiếp tục an toàn.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-sm bg-primary-control px-4 font-semibold text-white"
        >
          Thử lại
        </Link>
      </div>
    </main>
  );
}
