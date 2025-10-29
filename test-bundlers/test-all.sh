#!/bin/bash

# Test bundler compatibility for @googlemaps/js-api-loader
# This script tests that the library works with various popular bundlers
# without requiring any configuration from the user.

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "======================================"
echo "Testing Bundler Compatibility"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Pack the library
echo "📦 Packing library..."
cd "$ROOT_DIR"
TARBALL=$(npm pack --silent 2> /dev/null)
echo "    created: $TARBALL"
echo ""

for bundler in vite webpack rollup ; do
  dir="$SCRIPT_DIR/${bundler}-test"

  (
    cd $dir
    # Install dependencies
    echo "  Installing dependencies for $bundler..."
    npm install --silent
    npm install --silent --no-save "../../$TARBALL"
  )
done

echo ""

# Function to test a bundler in production mode
test_bundler_prod() {
  local bundler=$1
  local dir="$SCRIPT_DIR/${bundler}-test"

  cd "$dir"

  echo "Testing $bundler (production)..."

  # Run production build
  echo "  Building (production)..."
  if npm run build > build.log 2>&1; then
    # Check for process.env.NODE_ENV references in actual code (not in strings/comments)
    # We pipe find to xargs to grep through all bundles at once.
    # The if condition checks the exit code of grep.
    if find dist -name "*.js" -type f -print0 | xargs -0 grep -qE "process\.env\.NODE_ENV|process\.env\\["; then
      echo -e "  ${RED}✗ NUM_FAILED${NC} - Found process.env.NODE_ENV in bundle code"
      return 1
    fi

    # Verify that importLibrary is still present (not tree-shaken)
    if ! find dist -name "*.js" -type f -exec grep -q "importLibrary" {} \;; then
      echo -e "  ${RED}✗ NUM_FAILED${NC} - importLibrary was incorrectly tree-shaken"
      return 1
    fi

    echo -e "  ${GREEN}✓ PASSED${NC} - process.env replaced, bundle optimized"
    return 0
  else
    echo -e "  ${RED}✗ NUM_FAILED${NC} - Build error"
    echo "~~~~ build log:"
    cat build.log
    echo "~~~~"

    return 1
  fi
}

# Function to test a bundler in development mode
test_bundler_dev() {
  local bundler=$1
  local dir="$SCRIPT_DIR/${bundler}-test"

  cd "$dir"

  echo "Testing $bundler (development)..."

  # Run development build
  echo "  Building (development)..."
  rm -rf dist
  if npm run build:dev > build-dev.log 2>&1; then
    # Check that dev warning code is present in the bundle
    # We look for the actual console.warn message, not just the function definition.
    if find dist -name "*.js" -type f -print0 | xargs -0 grep -qE "console\.warn.*@googlemaps/js-api-loader"; then
      echo -e "  ${GREEN}✓ PASSED${NC} - dev warnings preserved"
      return 0
    else
      echo -e "  ${RED}✗ NUM_FAILED${NC} - dev warning code not found (dead code eliminated incorrectly)"
      cat build-dev.log
      return 1
    fi
  else
    echo -e "  ${RED}✗ NUM_FAILED${NC} - Build error"
    cat build-dev.log
    return 1
  fi
}

NUM_FAILED=0

# Production mode tests
echo "========== PRODUCTION MODE =========="

for bundler in vite webpack rollup ; do
  echo ""
  test_bundler_prod $bundler || NUM_FAILED=$((NUM_FAILED + 1))
done
echo ""

# Development mode tests
echo "========== DEVELOPMENT MODE =========="
for bundler in vite webpack rollup ; do
  echo ""
  test_bundler_dev $bundler || NUM_FAILED=$((NUM_FAILED + 1))
done
echo ""

# Summary
echo "======================================"
if [ $NUM_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All bundler tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ $NUM_FAILED bundler test(s) failed${NC}"
  exit 1
fi
