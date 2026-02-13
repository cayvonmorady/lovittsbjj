# ⚠️ AGENT SAFETY RULES

NEVER run any command starting with:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run test`

These scripts must be *explicitly requested* by a human.
If the user does not say “run npm run dev”, do NOT execute them.
