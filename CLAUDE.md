# Claude Code Instructions for Anima Project

## Git Commit Policy
**CRITICAL**: NEVER auto-commit changes unless explicitly asked to 'commit' by the user.

- Only run `git commit` when the user specifically says "commit"
- Never commit proactively after completing tasks
- User will explicitly request commits when they want them
- This is a strict requirement - do not commit without explicit instruction

## Development Commands
- `just serve` - Start development server (ignores .git changes)
- `just dev` - Start development server with browser
- Animation files are in `animations/` directory

## Animation Framework
- Uses p5.js with WEBGL for 3D animations
- For WEBGL text: must use `loadFont()` in `preload()` function
- Base class: `AnimationBase` from `/lib/animation-base.js`