# Weekly planning skill (loaded on demand by Eve)

When the user asks to plan a week of life admin:

1. Call `list_life_admin_tasks` with category `all`.
2. Group tasks by day (Mon–Sun), put urgent items first.
3. Offer one optional sandbox check (e.g. print the plan as JSON via `run_in_sandbox`) only if useful.
4. Keep the plan short — bullets, not paragraphs.
