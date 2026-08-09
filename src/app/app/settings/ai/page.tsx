import { Badge } from "@/components/ui";
import { AISettingsForm } from "@/features/ai/chat/ai-settings-form";
import { getAssistantData } from "@/features/ai/chat/chat.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function AISettingsPage() {
  const user = await requireUser();
  const data = await getAssistantData(user.id);
  return (
    <div className="space-y-6">
      <header>
        <Badge variant="primary">Owner only</Badge>
        <h1 className="mt-4 text-3xl font-semibold">AI Settings</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Kiểm soát AI, lịch sử và từng loại context. Auth email, secret, token
          và database URL không bao giờ được đưa vào context.
        </p>
      </header>
      <AISettingsForm settings={data.settings} />
    </div>
  );
}
