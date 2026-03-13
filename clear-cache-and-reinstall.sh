#!/bin/bash
# Script to clear all cache and reinstall @spiral/rn-form module
# Usage: Run this in your React Native project directory

set -e

echo "🧹 Clearing @spiral/rn-form cache and reinstalling..."
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this in your React Native project root."
    exit 1
fi

# Stop Metro if running
echo "1️⃣ Stopping Metro bundler (if running)..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || echo "   No Metro process found on port 8081"

# Remove old module
echo ""
echo "2️⃣ Removing old @spiral/rn-form module..."
rm -rf node_modules/@spiral
echo "   ✓ Removed node_modules/@spiral"

# Clear all caches
echo ""
echo "3️⃣ Clearing all caches..."
rm -rf node_modules/.cache
echo "   ✓ Cleared node_modules/.cache"

rm -rf $TMPDIR/metro-* 2>/dev/null || true
echo "   ✓ Cleared Metro cache"

rm -rf $TMPDIR/haste-map-* 2>/dev/null || true
echo "   ✓ Cleared Haste map cache"

rm -rf $TMPDIR/react-* 2>/dev/null || true
echo "   ✓ Cleared React cache"

# Clear watchman
echo ""
echo "4️⃣ Clearing Watchman..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all
    echo "   ✓ Watchman cleared"
else
    echo "   ⚠️  Watchman not found (skip)"
fi

# Clear Android build cache (if exists)
if [ -d "android" ]; then
    echo ""
    echo "5️⃣ Clearing Android build cache..."
    cd android
    ./gradlew clean 2>/dev/null || echo "   ⚠️  Gradle clean skipped"
    cd ..
    rm -rf android/app/build
    echo "   ✓ Android cache cleared"
fi

# Reinstall module from git
echo ""
echo "6️⃣ Reinstalling @spiral/rn-form from GitHub..."
npm install git+https://github.com/haitranict/form-rn.git#main --force
echo "   ✓ Module reinstalled"

# Final instructions
echo ""
echo "✅ Done! Now run:"
echo ""
echo "   Terminal 1:"
echo "   npx react-native start --reset-cache"
echo ""
echo "   Terminal 2:"
echo "   npx react-native run-android"
echo ""
echo "   (or run-ios for iOS)"
echo ""
