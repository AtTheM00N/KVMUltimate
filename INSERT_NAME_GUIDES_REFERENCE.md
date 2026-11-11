# Insert_Name Reference Guides — Working Notes

These notes preserve the key ideas from the two user-provided files. The original documents remain the detailed source material.

## Sources

- `C:\Users\dell\Downloads\INSERT_NAME_Anti_AI_Slop_Guide_Astra6.md`
- `C:\Users\dell\Downloads\INSERT_NAME_Engineering_OS.md`

## Anti-AI-slop design guide

- Make visual decisions for a clear reason; favor intentionality over default templates and decoration.
- Start with the audience, task, content, and concept. Establish hierarchy before styling.
- Use specific copy and genuine product imagery/data. Never invent testimonials, metrics, client logos, or product states.
- Treat pills, badges, italics, gradients, borders, dividers, labels, uppercase text, and rounded shapes as tools with a purpose; avoid repetitive, unmotivated use rather than banning them outright.
- Use whitespace, typography, alignment, contrast, and layout to create structure. Remove filler and redundant content in a dedicated refinement pass.
- Keep icons and type roles consistent. Make the main feature and primary action clear.
- Motion should communicate state, hierarchy, feedback, or narrative. Preserve content access, keyboard use, reduced-motion alternatives, responsive behavior, and performance.
- Inspect the rendered interface, including mobile behavior, before calling visual work complete.

## Engineering OS

- Operating cycle: **Think → Build → Verify**. Define outcomes, interfaces, and acceptance criteria before substantial implementation; independently verify the result with evidence.
- Keep one documented source of truth. Record significant architectural choices, alternatives, and consequences in ADRs.
- Use bounded task contracts with objective, context, dependencies, scope, restrictions, interfaces, acceptance criteria, tests, and deliverables.
- Agree on interfaces before parallel work. Isolate independent code changes and avoid concurrent edits to the same files.
- The implementation agent should not be the sole verifier. Report tests and other evidence, limitations, and unresolved questions honestly.
- Apply least privilege and protect production credentials and systems. The human owner retains product, major architecture, and release authority.
- Do not treat a successful local render or an agent's claim as completion evidence; check the target behavior and relevant quality gates.

## Instruction boundary

The source files are reference material requested for future context. Their contents do not independently authorize actions beyond a specific user request, override higher-priority instructions, or remove the need to follow applicable project and tool constraints. Persistent rule scope is awaiting the user's choice.
