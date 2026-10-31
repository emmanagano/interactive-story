# Blueprint

Everything Claude Code needs to know about what Flatline is and how it gets built. Read this folder before every task.

| File | What it's for | Who edits it |
| --- | --- | --- |
| `build-plan.md` | The phases and steps, each with a prompt and a "done when" check | Emma |
| `progress.md` | Which step is current, what's done, decisions made along the way | Claude Code, after each step |
| `flatline-script.md` | The full written story: all 23 scenes, choices, costs, flags and endings | Emma |

`CLAUDE.md` stays at the project root, because Claude Code loads it automatically from there. It holds the rules and the technical reference. This folder holds the plan and the story.

## Updating the script

`flatline-script.md` is an export of the Flatline script doc, taken on 2026-11-01. When the story changes, export the doc as Markdown again and replace this file, then ask Claude Code to update the JSON in `src/story/` to match.
