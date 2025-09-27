# Animation development commands

# List available commands
default:
    @just --list

# Start development server
dev:
    npm run dev

# Serve without opening browser
serve:
    npm run serve

# Create a new animation from template
new name:
    @echo "Creating new animation: {{name}}"
    mkdir -p animations/{{name}}
    cp lib/animation-template.js animations/{{name}}/sketch.js
    sed -i '' 's/TemplateAnimation/{{name}}/g' animations/{{name}}/sketch.js
    cp lib/animation-template.html animations/{{name}}/index.html
    sed -i '' 's/Template Animation/{{name}}/g' animations/{{name}}/index.html
    just _update-registry
    @echo "Created animations/{{name}}/"
    @echo "Open http://localhost:3000/animations/{{name}}/ to view"

# Serve a specific animation
serve-animation name:
    live-server --port=3000 --open=/animations/{{name}}/ --no-browser

# Install dependencies
install:
    npm install

# List all available animations
list:
    @echo "Available animations:"
    @find animations -name "index.html" | sed 's|animations/||' | sed 's|/index.html||' | sort

# Clean exports directory
clean:
    rm -rf exports/*
    @echo "Cleaned exports directory"

# Export all animations (requires manual trigger in each animation)
export-info:
    @echo "To export animations:"
    @echo "1. Open animation in browser"
    @echo "2. Press 'R' to start recording"
    @echo "3. GIF will be saved automatically after 10 seconds"
    @echo "4. Check browser downloads folder"

# Setup git hooks (if using git)
setup-git:
    @if [ -d .git ]; then \
        echo "Setting up git hooks..."; \
        echo "*.gif" >> .gitignore; \
        echo "node_modules/" >> .gitignore; \
        echo "exports/" >> .gitignore; \
    else \
        echo "Not a git repository"; \
    fi

# Development help
help:
    @echo "Available commands:"
    @echo "  just dev              - Start development server"
    @echo "  just new <name>       - Create new animation"
    @echo "  just serve-animation <name> - Serve specific animation"
    @echo "  just list             - List all animations"
    @echo "  just export-info      - Show export instructions"
    @echo "  just clean            - Clean exports directory"
    @echo "  just install          - Install dependencies"

# Update animation registry (internal) - simplified
_update-registry:
    @echo "Registry is now maintained manually in animations/registry.json"