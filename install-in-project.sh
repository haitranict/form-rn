#!/bin/bash

# Quick Install Script for Project
# Run này trong project của bạn để install module nhanh

echo "================================================"
echo "  Install @spiral/rn-form từ Git"
echo "================================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

GIT_URL="git+https://github.com/haitranict/form-rn.git#main"

echo -e "${YELLOW}Checking environment...${NC}"

# Check if in a React Native project
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found!${NC}"
    echo "Please run this script in your React Native project root."
    exit 1
fi

echo -e "${GREEN}✓ Found package.json${NC}"
echo ""

# Step 1: Clear npm cache
echo -e "${YELLOW}Step 1: Clearing npm cache...${NC}"
npm cache clean --force
echo -e "${GREEN}✓ Cache cleared${NC}"
echo ""

# Step 2: Remove old version
echo -e "${YELLOW}Step 2: Removing old @spiral/rn-form...${NC}"
npm uninstall @spiral/rn-form 2>/dev/null
rm -rf node_modules/@spiral/rn-form 2>/dev/null
echo -e "${GREEN}✓ Old version removed${NC}"
echo ""

# Step 3: Install from git
echo -e "${YELLOW}Step 3: Installing from git...${NC}"
echo "URL: $GIT_URL"
npm install "$GIT_URL" --verbose

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Installed successfully!${NC}"
else
    echo ""
    echo -e "${RED}✗ Installation failed${NC}"
    exit 1
fi

# Step 4: Check installation
echo ""
echo -e "${YELLOW}Step 4: Verifying installation...${NC}"
if [ -d "node_modules/@spiral/rn-form" ]; then
    echo -e "${GREEN}✓ Module found in node_modules${NC}"
    
    # Check lib folder
    if [ -d "node_modules/@spiral/rn-form/lib" ]; then
        echo -e "${GREEN}✓ Built files found${NC}"
    else
        echo -e "${RED}✗ Built files not found${NC}"
        echo "  Module might need to be rebuilt"
    fi
else
    echo -e "${RED}✗ Module not found${NC}"
    exit 1
fi

# Step 5: Clear Metro cache
echo ""
echo -e "${YELLOW}Step 5: Clearing Metro cache...${NC}"
rm -rf $TMPDIR/react-* 2>/dev/null
rm -rf $TMPDIR/metro-* 2>/dev/null
rm -rf $TMPDIR/haste-* 2>/dev/null
echo -e "${GREEN}✓ Metro cache cleared${NC}"

# Done
echo ""
echo "================================================"
echo -e "${GREEN}SUCCESS! Module installed!${NC}"
echo "================================================"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Import trong code:"
echo "   import { SFormList, SFormResult } from '@spiral/rn-form';"
echo ""
echo "2. Start Metro với reset cache:"
echo "   npx react-native start --reset-cache"
echo ""
echo "3. Rebuild app:"
echo "   npx react-native run-android"
echo "   # hoặc"
echo "   npx react-native run-ios"
echo ""
echo "================================================"
