import { Badge } from "@/components/ui";
import { AIAssistantShell } from "@/features/ai/components/ai-assistant-shell";
import { getAIConfig } from "@/features/ai/config/ai.config";

export default function AIAssistantPage() {
  const config = getAIConfig();
  return (
    <div className="space-y-6">
      <header>
        <Badge variant="primary">Development mock</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          AI Assistant
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground-secondary sm:text-base">
          Tạo và xem trước structured proposal an toàn. AI chỉ đề xuất; dữ liệu
          kế hoạch chỉ được tạo sau khi owner xác nhận proposal hiện tại.
        </p>
      </header>
      <AIAssistantShell
        enabled={config.enabled}
        provider="mock"
        model={config.models.mock}
      />
    </div>
  );
}
