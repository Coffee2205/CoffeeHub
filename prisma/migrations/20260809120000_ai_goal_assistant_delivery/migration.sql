CREATE TYPE "AIProposalStatus" AS ENUM ('DRAFT', 'COMMITTED', 'DISCARDED', 'FAILED');

CREATE TABLE "ai_proposals" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "action" VARCHAR(80) NOT NULL,
  "status" "AIProposalStatus" NOT NULL DEFAULT 'DRAFT',
  "payload" JSONB NOT NULL,
  "payload_hash" VARCHAR(64) NOT NULL,
  "confirmation_id" UUID NOT NULL,
  "result" JSONB,
  "committed_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "ai_proposals_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_proposals_confirmation_id_key" UNIQUE ("confirmation_id"),
  CONSTRAINT "ai_proposals_id_user_id_key" UNIQUE ("id", "user_id"),
  CONSTRAINT "ai_proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ai_action_logs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "proposal_id" UUID NOT NULL,
  "action" VARCHAR(80) NOT NULL,
  "status" VARCHAR(40) NOT NULL,
  "payload_hash" VARCHAR(64) NOT NULL,
  "confirmation_id" UUID,
  "details" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_action_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_action_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ai_action_logs_proposal_id_user_id_fkey" FOREIGN KEY ("proposal_id", "user_id") REFERENCES "ai_proposals"("id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ai_proposals_user_id_status_updated_at_idx" ON "ai_proposals"("user_id", "status", "updated_at");
CREATE INDEX "ai_action_logs_user_id_created_at_idx" ON "ai_action_logs"("user_id", "created_at");
CREATE INDEX "ai_action_logs_proposal_id_created_at_idx" ON "ai_action_logs"("proposal_id", "created_at");

ALTER TABLE "ai_proposals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_action_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_proposals" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ai_action_logs" FORCE ROW LEVEL SECURITY;

REVOKE ALL ON "ai_proposals" FROM anon, authenticated;
REVOKE ALL ON "ai_action_logs" FROM anon, authenticated;
GRANT SELECT ON "ai_proposals" TO authenticated;
GRANT SELECT ON "ai_action_logs" TO authenticated;

CREATE POLICY "ai_proposals_owner_select" ON "ai_proposals"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user_id");

CREATE POLICY "ai_action_logs_owner_select" ON "ai_action_logs"
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = "user_id");
