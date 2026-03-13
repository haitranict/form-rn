#!/bin/bash

# Quick Setup Script for @spiral/rn-form
# This script helps you push module to git and install in your project

echo "================================================"
echo "  @spiral/rn-form - Git Setup & Install"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Get Git URL
echo -e "${YELLOW}Step 1: Enter your Git repository URL${NC}"
echo "Example: https://github.com/yourusername/rn-form.git"
echo "         git@github.com:yourusername/rn-form.git"
echo ""
read -p "Git URL: " GIT_URL

if [ -z "$GIT_URL" ]; then
    echo -e "${RED}Error: Git URL is required!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Git URL: $GIT_URL${NC}"
echo ""

# Step 2: Add remote (if not exists)
echo -e "${YELLOW}Step 2: Adding remote repository...${NC}"
git remote remove origin 2>/dev/null  # Remove if exists
git remote add origin "$GIT_URL"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Remote added${NC}"
else
    echo -e "${RED}✗ Failed to add remote${NC}"
    exit 1
fi

# Step 3: Push to git
echo ""
echo -e "${YELLOW}Step 3: Pushing to git...${NC}"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Pushed to git successfully!${NC}"
else
    echo -e "${RED}✗ Failed to push to git${NC}"
    echo "  Please check:"
    echo "  - Git credentials"
    echo "  - Repository exists"
    echo "  - You have write permission"
    exit 1
fi

# Step 4: Create tag
echo ""
echo -e "${YELLOW}Step 4: Creating tag v1.0.0...${NC}"
git tag v1.0.0 2>/dev/null
git push origin v1.0.0

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Tag v1.0.0 created${NC}"
fi

# Step 5: Instructions for project
echo ""
echo "================================================"
echo -e "${GREEN}SUCCESS! Module đã được push lên git!${NC}"
echo "================================================"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Install module trong project của bạn:"
echo -e "   ${GREEN}cd <your-project>${NC}"
echo -e "   ${GREEN}npm install $GIT_URL${NC}"
echo ""
echo "2. Hoặc update package.json:"
echo "   {"
echo "     \"dependencies\": {"
echo "       \"@spiral/rn-form\": \"$GIT_URL#v1.0.0\""
echo "     }"
echo "   }"
echo ""
echo "3. Import trong code:"
echo "   import { SFormList, SFormResult } from '@spiral/rn-form';"
echo ""
echo "4. Clear cache và rebuild:"
echo "   npx react-native start --reset-cache"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "   - Setup guide:     GIT_SETUP.md"
echo "   - Navigation:      NAVIGATION_EXAMPLE.tsx"
echo "   - Authorization:   AUTHORIZATION.md"
echo "   - API Ready:       API_READY.md"
echo ""
echo "================================================"
echo -e "${GREEN}Have fun coding! 🎉${NC}"
echo "================================================"
