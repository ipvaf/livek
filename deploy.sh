#!/bin/bash
# Livek deploy script — pushes to GitHub and deploys to Vercel production
set -e

echo "🚀 Deploying Livek..."
git push origin main
npx vercel --prod
echo "✅ Done — https://livek.vercel.app"
