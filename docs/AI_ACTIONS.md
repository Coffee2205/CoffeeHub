# AI Actions

`AI_ACTIONS` is the canonical typed registry for Chat, Goal analysis/proposal, Roadmap/Task/Checklist proposal, daily/weekly planning, progress review and note summary. String literals outside the registry are not allowed.

Create proposals require confirmation and are marked as future database-writing operations, but AI Foundation does not execute them. Chat, analysis, review and summarization are read-only. Destructive operations, auth/role changes, CMS publishing, media deletion, migrations, site-setting changes and unconfirmed bulk updates are forbidden.

Proposal → mapper → existing form values → owner review → existing Feature Service is the required integration path. AI output never calls a repository or Prisma.
