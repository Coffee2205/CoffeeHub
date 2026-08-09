# AI Entity Linking

CoffeeHub treats planning as one owner-scoped graph, not one new graph per prompt.

## Resolution flow

1. Normalize the request and active entity hint.
2. Query bounded active/recent Goals, Roadmaps, Stages and Tasks.
3. Rank title/keyword matches without embeddings.
4. Recommend `LINK_EXISTING`, `EXTEND_EXISTING` or `CREATE_NEW` with confidence.
5. Ask the owner to resolve ambiguous candidates.
6. Store generated content separately from server-derived relationship IDs.
7. Reload ownership and validate hierarchy at save and confirm.

## Relationship rules

- Roadmap parent Goal must exist and belong to the owner.
- Stage must belong to the selected Roadmap.
- Task may link Goal, Roadmap and Stage only when the chain matches.
- Checklist has at most one direct Goal, Roadmap or Task parent under D-014.
- Conversation/source context is only a hint and is always revalidated.

## Duplicate and extension behavior

A similar Goal is reused by default, with Create New available as an explicit override. A Roadmap request links a matching Goal. If the Roadmap already exists, the default becomes `EXTEND_EXISTING`, and confirmation appends only the previewed Stage/Task additions transactionally. Nothing is silently merged, updated or linked at low confidence.

## Security

The model never chooses trusted UUIDs and never writes the database. Candidate IDs originate from owner-scoped queries, dropdowns contain only those candidates, proposal edits invalidate confirmation, and the server returns `RELATIONSHIP_CONFLICT` for stale, foreign or mismatched parents.
