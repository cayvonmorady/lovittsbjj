# AGENT SAFETY RULES

NEVER run any command starting with:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run test`

These scripts must be explicitly requested by a human.
If the user does not say "run npm run dev", do NOT execute them.

## ROOT-CAUSE-FIRST IMPLEMENTATION RULES

Do not guess. Do not apply speculative fixes.

Before making any code change, the agent must:
1. Reproduce or isolate the issue using non-mutating checks.
2. Identify the most likely root cause in existing code/config/build output.
3. Present a brief diagnosis with concrete evidence (file paths, lines, command findings).
4. Implement a fix that directly addresses that root cause.

Evidence requirements:
- Cite at least 2 concrete signals when possible (for example: source file + compiled output, or config + runtime usage).
- If confidence is not high, continue diagnosing before patching.
- Never frame a first pass as a "possible" fix unless the user explicitly asks for experimentation.

Verification requirements after patching:
1. Re-check the original failing condition.
2. Confirm the specific root-cause condition is now resolved.
3. Report what was verified and what could not be verified locally.

UI/CSS/Tailwind safeguard:
- When a style utility appears not to render, verify utility generation and applicability before changing component code.
- Check both source usage and produced CSS artifacts (or equivalent build evidence) before deciding the fix path.

Communication standard:
- Lead with diagnosis first, then fix.
- Include exact file references for the cause and for the fix.
- Keep updates concise, factual, and implementation-focused.
