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

# Update animation registry (internal)
_update-registry:
    @echo "Updating animation registry..."
    @echo '[' > animations/registry.json
    @first=true; \
    for dir in animations/*/; do \
        if [ -f "$$dir/index.html" ]; then \
            name=$$(basename "$$dir"); \
            if [ "$$first" = true ]; then \
                first=false; \
            else \
                echo ',' >> animations/registry.json; \
            fi; \
            title=$$(grep -o '<title>[^<]*</title>' "$$dir/index.html" | sed 's/<title>\(.*\) Animation<\/title>/\1/' || echo "$$name"); \
            desc=$$(grep -o '<p>[^<]*</p>' "$$dir/index.html" | head -1 | sed 's/<p>\(.*\)<\/p>/\1/' || echo "Animation: $$name"); \
            echo "  {" >> animations/registry.json; \
            echo "    \"name\": \"$$name\"," >> animations/registry.json; \
            echo "    \"title\": \"$$title\"," >> animations/registry.json; \
            echo "    \"description\": \"$$desc\"" >> animations/registry.json; \
            echo -n "  }" >> animations/registry.json; \
        fi; \
    done
    @echo '' >> animations/registry.json
    @echo ']' >> animations/registry.json
    @echo "Registry updated"