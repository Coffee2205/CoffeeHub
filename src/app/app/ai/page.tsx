import { Badge } from "@/components/ui";
import { AIAssistantShell } from "@/features/ai/components/ai-assistant-shell";
import { getAIConfig } from "@/features/ai/config/ai.config";
import { PersonalAssistantShell } from "@/features/ai/chat/personal-assistant-shell";
import { getAssistantData } from "@/features/ai/chat/chat.repository";
import { requireUser } from "@/lib/supabase/auth";
import { listNotes } from "@/features/notes/note.repository";

export default async function AIAssistantPage() {
  const user = await requireUser();
  const [data, notes] = await Promise.all([
    getAssistantData(user.id),
    listNotes(user.id),
  ]);
  const config = getAIConfig();
  return (
    <div className="space-y-6">
      <header>
        <Badge variant="primary">Development mock</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          AI Assistant
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground-secondary sm:text-base">
          Chat nhiều lượt với context tối thiểu, lập kế hoạch và tạo structured
          proposal an toàn. Mọi thay đổi dữ liệu vẫn cần owner xác nhận.
        </p>
      </header>
      <PersonalAssistantShell
        initialConversations={data.conversations.map((item) => ({
          id: item.id,
          title: item.title,
          updatedAt: item.updatedAt.toISOString(),
        }))}
        initialMessages={data.messages.map((item) => ({
          id: item.id,
          role: item.role,
          content: item.content,
          createdAt: item.createdAt.toISOString(),
        }))}
        initialConversationId={data.selectedId}
        settings={data.settings}
      />
      <div>
        <h2 className="text-2xl font-semibold">Action proposals</h2>
        <p className="mt-2 text-sm text-muted">
          Tách biệt với chat; chỉ nút xác nhận proposal hiện tại mới ghi dữ
          liệu.
        </p>
      </div>
      <AIAssistantShell
        enabled={config.enabled}
        provider="mock"
        model={config.models.mock}
        notes={notes.map((note) => ({ id: note.id, title: note.title }))}
      />
    </div>
  );
}
