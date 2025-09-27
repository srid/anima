{
  description = "Animation repository for psychology and spirituality concepts";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];
      perSystem = { config, self', inputs', pkgs, system, ... }: {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
            just
            nodePackages.live-server
            ffmpeg
          ];

          shellHook = ''
            echo "🎨 Animation development environment ready!"
            echo "Available commands:"
            echo "  just dev      - Start development server"
            echo "  just new NAME - Create new animation"
            echo "  just export   - Export animations to GIF"
            echo ""
            echo "Video conversion:"
            echo "  nix run .#convert -- input.webm  - Convert WebM to MP4"
            echo ""
            echo "Run 'just' to see all available commands"
          '';
        };

        apps.convert = {
          type = "app";
          program = pkgs.lib.getExe (pkgs.writeShellApplication {
            name = "webm-to-mp4";
            runtimeInputs = [ pkgs.ffmpeg ];
            text = ''
              if [ $# -eq 0 ]; then
                echo "Usage: nix run .#convert -- <input.webm>"
                echo "Converts WebM video to MP4 format optimized for social media"
                exit 1
              fi
              
              input="$1"
              
              # Check if input file exists
              if [ ! -f "$input" ]; then
                echo "Error: File '$input' not found"
                exit 1
              fi
              
              # Generate output filename
              output="''${input%.*}.mp4"
              
              echo "🎬 Converting $input to $output..."
              echo "📱 Optimizing for social media (X.com/Twitter)..."
              
              # Convert with optimal settings for social media
              ffmpeg \
                -i "$input" \
                -c:v libx264 \
                -preset medium \
                -crf 23 \
                -movflags +faststart \
                -pix_fmt yuv420p \
                -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
                -y \
                "$output"
              
              echo "✅ Conversion complete!"
              echo "📤 Upload $output to X.com/Twitter"
              
              # Show file sizes
              input_size=$(du -h "$input" | cut -f1)
              output_size=$(du -h "$output" | cut -f1)
              echo "📊 File sizes: $input ($input_size) → $output ($output_size)"
            '';
          });
        };
      };
    };
}