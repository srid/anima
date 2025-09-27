
# Anima

Abstract animations for explaining concepts using shapes and visual metaphors.

## Tech Stack

- p5.js (LLM-optimized)
- justfile for development workflow
- Individual animation files for easy organization

## Development

```bash
direnv allow         # Enter dev environment
just install         # Install dependencies
just dev             # Start development server
just new <name>      # Create new animation
```

Each animation lives in `animations/<name>/` with its own `sketch.js` and `index.html`.

Press `R` in any animation to record GIF export.
# Test change for PR
