#!/bin/bash
# ---------------------------------------------------------------
# AlgoYo'l — upload local changes to github.com/khos019/CP-project
# Keeps the existing commit history. Run it from the project folder:
#
#     bash push-to-github.sh
#
# Safe to run more than once.
# ---------------------------------------------------------------
set -e

REPO="https://github.com/khos019/CP-project.git"
BRANCH="main"

cd "$(dirname "$0")"
echo "==> Folder: $(pwd)"
echo

# 1. Make sure secrets can never be committed -----------------------------
if ! grep -qE '^\.env\*' .gitignore; then
  echo ".env*" >> .gitignore
fi
if ! grep -q 'tsbuildinfo' .gitignore; then
  echo "*.tsbuildinfo" >> .gitignore
fi

# 2. Initialise git if this folder came from a ZIP -------------------------
if [ ! -d .git ]; then
  echo "==> No git history found (ZIP download). Initialising..."
  git init -b "$BRANCH"
fi

git config user.name  "Muxammadali Ubaydullayev"
git config user.email "m.u.ubaydullayev@gmail.com"

# 3. Point at the GitHub repo ---------------------------------------------
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO"
else
  git remote add origin "$REPO"
fi
echo "==> Remote: $(git remote get-url origin)"
echo

# 4. Download the existing history ----------------------------------------
echo "==> Fetching existing history from GitHub..."
echo "    (If a browser window or a login prompt appears, sign in to GitHub.)"
git fetch origin "$BRANCH"

# 5. Attach our files on top of that history, without touching the files ---
git reset --mixed "origin/$BRANCH"

# 6. Show what will be uploaded -------------------------------------------
echo
echo "==> These files changed:"
git add -A
git status --short
echo

if git diff --cached --quiet; then
  echo "==> Nothing to upload. Everything is already on GitHub."
  exit 0
fi

# 7. Safety check: never upload .env files --------------------------------
if git diff --cached --name-only | grep -qE '^\.env'; then
  echo "!!! STOP: a .env file is about to be committed. Aborting."
  git reset
  exit 1
fi

# 8. Commit and push -------------------------------------------------------
git commit -m "Advanced duel arena, Supabase roles (owner/admin/user), setup docs"
echo
echo "==> Pushing to GitHub..."
git push origin "$BRANCH"

echo
echo "==> Done. Open: https://github.com/khos019/CP-project"
