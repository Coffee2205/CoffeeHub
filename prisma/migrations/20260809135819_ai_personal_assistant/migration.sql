CREATE TYPE "AIMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

CREATE TABLE "ai_conversations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL,
  "title" VARCHAR(160) NOT NULL, "archived_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_conversations_id_user_id_key" UNIQUE ("id", "user_id"),
  CONSTRAINT "ai_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ai_messages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL,
  "conversation_id" UUID NOT NULL, "role" "AIMessageRole" NOT NULL,
  "content" TEXT NOT NULL, "context_summary" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ai_messages_conversation_id_user_id_fkey" FOREIGN KEY ("conversation_id", "user_id") REFERENCES "ai_conversations"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ai_settings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true, "history_enabled" BOOLEAN NOT NULL DEFAULT true,
  "include_goals" BOOLEAN NOT NULL DEFAULT true, "include_tasks" BOOLEAN NOT NULL DEFAULT true,
  "include_notes" BOOLEAN NOT NULL DEFAULT false, "retention_days" INTEGER NOT NULL DEFAULT 30,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "ai_settings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_settings_user_id_key" UNIQUE ("user_id"),
  CONSTRAINT "ai_settings_retention_days_check" CHECK ("retention_days" BETWEEN 1 AND 365),
  CONSTRAINT "ai_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ai_conversations_user_id_archived_at_updated_at_idx" ON "ai_conversations"("user_id", "archived_at", "updated_at");
CREATE INDEX "ai_messages_conversation_id_created_at_idx" ON "ai_messages"("conversation_id", "created_at");
CREATE INDEX "ai_messages_user_id_created_at_idx" ON "ai_messages"("user_id", "created_at");

ALTER TABLE "ai_conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_conversations" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ai_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_messages" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ai_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_settings" FORCE ROW LEVEL SECURITY;
REVOKE ALL ON "ai_conversations", "ai_messages", "ai_settings" FROM anon, authenticated;
GRANT SELECT ON "ai_conversations", "ai_messages", "ai_settings" TO authenticated;
CREATE POLICY "ai_conversations_owner_select" ON "ai_conversations" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = "user_id");
CREATE POLICY "ai_messages_owner_select" ON "ai_messages" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = "user_id");
CREATE POLICY "ai_settings_owner_select" ON "ai_settings" FOR SELECT TO authenticated USING ((SELECT auth.uid()) = "user_id");
