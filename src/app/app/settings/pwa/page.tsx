import { Badge, Card } from "@/components/ui";
import { InstallCard } from "@/features/pwa/install-card";
export default function PwaSettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <Badge variant="primary">PWA</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Cài đặt & ngoại tuyến</h1>
        <p className="mt-2 text-foreground-secondary">
          Cài CoffeeHub và xem chính sách offline an toàn.
        </p>
      </header>
      <InstallCard />
      <Card>
        <h2 className="text-xl font-semibold">Phạm vi offline v1</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-foreground-secondary">
          <li>Chỉ cache offline fallback và icon ứng dụng.</li>
          <li>
            Không cache token, auth response, signed URL hoặc trang dữ liệu
            riêng tư.
          </li>
          <li>
            Mutation queue chưa bật cho đến khi có endpoint allow-list,
            idempotency và Auth revalidation.
          </li>
          <li>
            Logout hoặc session hết hạn không thể phát lại mutation từ phiên cũ.
          </li>
        </ul>
      </Card>
    </div>
  );
}
