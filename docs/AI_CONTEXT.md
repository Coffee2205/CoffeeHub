# AI Context

Context is an allow-listed DTO, never a database dump. Supported boundaries are User, Workspace, Goal, Roadmap, Task, Calendar, Notes and Planning Preferences. Builders receive the authenticated owner identity upstream and repositories must scope every query by that owner.

Rules:

- omit auth email, password, cookies, tokens, keys and connection strings;
- omit unrelated private workspace and CMS data;
- cap record collections (currently 20 in the skeleton);
- attach locale, timezone and an explicit token budget;
- use excerpts for notes and summaries for workloads;
- treat all context text as untrusted data, not executable instructions.

The current mock page uses only the owner request and safe locale/timezone defaults. Database-backed builders are deferred until the corresponding feature integrations exist.
