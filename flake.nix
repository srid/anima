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
          ];

          shellHook = ''
            echo "🎨 Animation development environment ready!"
            echo "Available commands:"
            echo "  just dev      - Start development server"
            echo "  just new NAME - Create new animation"
            echo "  just export   - Export animations to GIF"
            echo ""
            echo "Run 'just' to see all available commands"
          '';
        };
      };
    };
}
