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

The current mock page uses only the owner request and safe locale/timezone defaults. Database-backed builders are deferred until the corresponding feature integrations exist.
