# AI Actions

`AI_ACTIONS` is the canonical typed registry for Chat, Goal analysis/proposal, Roadmap/Task/Checklist proposal, Event/Calendar proposal, Note proposal/summary, daily/weekly planning and progress review. String literals outside the registry are not allowed.

Chat, analysis, review and summarization are read-only. Every create/update proposal affecting CoffeeHub data requires an editable preview and explicit owner confirmation. Destructive operations, auth/role changes, CMS publishing, media deletion, migrations, site-setting changes and unconfirmed bulk updates are forbidden.

Proposal → mapper → existing form values → owner review → existing Feature Service is the required integration path. AI output never calls a repository or Prisma.

After confirmation, the server revalidates the exact proposal, derives `userId` from the verified session, checks ownership/relations, attaches an idempotency key and commits through the existing service. Multi-record Goal → Roadmap → Stage → Task plans use one transaction. Confirmation is single-use and expires when the proposal changes.
