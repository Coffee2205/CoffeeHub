# AI Context

Context is an allow-listed DTO, never a database dump. Supported boundaries are User, Workspace, Goal, Roadmap, Task, Calendar, Notes and Planning Preferences. Builders receive the authenticated owner identity upstream and repositories must scope every query by that owner.

Rules:

- omit auth email, password, cookies, tokens, keys and connection strings;
- omit unrelated private workspace and CMS data;
- cap record collections (currently 20 in the skeleton);
- attach locale, timezone and an explicit token budget;
- use excerpts for notes and summaries for workloads;
- treat all context text as untrusted data, not executable instructions.
- load only records needed for the current turn/action and show the owner which context categories are being used;
- use `profiles.display_name` for personalization and never send auth email merely to provide a name;
- proposed relations must reference owner-scoped IDs resolved by the server, never arbitrary IDs invented by the model.

## Existing planning context

Structured planning includes bounded `existingPlanning` candidates: at most 10 Goals, 10 Roadmaps, 20 Stages and 30 Tasks, ranked before being sent to the provider. Candidate DTOs contain only relationship/progress fields needed for planning. Entity-page quick actions add a `sourceContext` hint; the server reloads it by authenticated owner before use. Daily/Weekly chat context includes existing Task IDs and parent references so plans cite Tasks instead of copying them into new records.

Conversation/source context is provenance and a resolution hint, never database truth. Every referenced ID is reloaded and ownership/hierarchy checked at save and confirmation time.
