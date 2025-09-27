
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

## Video & GIF Export

### Video Export (Recommended for Social Media)

**Key Controls:**
- **`V`** = Start video recording
- **`S`** = Stop video recording

**Features:**
- **User-controlled duration**: Record as long or short as you want
- **High quality**: 60fps, full resolution (800x600)
- **Small file size**: ~100KB per second (~500KB for 5-second clip)
- **Format**: WebM (high quality, small files)
- **Real-time**: Instant download when stopped, no processing wait
- **Visual feedback**: Red recording indicator while active

**How to use:**
1. Press `V` to start recording (see red dot indicator)
2. Let the animation run for desired duration
3. Press `S` to stop and download `.webm` file

**For X.com/Twitter (requires MP4):**
```bash
# Convert WebM to MP4 using Nix
nix run .#convert -- your-video.webm
# Upload the resulting .mp4 file to X.com
```

### GIF Export (Legacy)

Press `R` in any animation to record a GIF export:

- **Duration**: Records for the animation's full cycle (e.g., 15 seconds for prism)  
- **Output**: Saves as `<animation-name>.gif`
- **File size**: ~8MB (large)
- **Processing time**: ~1 minute
- **Use case**: For platforms that don't support video

**Recommendation**: Use video export (`V`/`S`) for better quality and smaller files!
# Test change for PR
