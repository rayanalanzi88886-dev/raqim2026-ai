#!/bin/bash
# Raqim API - Quick Setup Script
# Run this from the project root

echo "🚀 Raqim API - Quick Setup"
echo "=========================="
echo ""

# Check if in correct directory
if [ ! -d "raqim-api" ]; then
  echo "❌ Error: raqim-api folder not found"
  echo "Please run this script from the project root"
  exit 1
fi

# Install Worker dependencies
echo "📦 Installing Worker dependencies..."
cd raqim-api
npm install

echo ""
echo "✅ Dependencies installed"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Login to Cloudflare:"
echo "   wrangler login"
echo ""
echo "2. Set secrets:"
echo "   wrangler secret put GEMINI_API_KEY"
echo "   wrangler secret put OPENAI_API_KEY"
echo "   wrangler secret put OPENAI_OSS_MODEL"
echo "   wrangler secret put ALLOWED_ORIGIN"
echo ""
echo "3. Test locally:"
echo "   npm run dev"
echo ""
echo "4. Deploy:"
echo "   npm run deploy"
echo ""
echo "5. Configure frontend .env with Worker URL"
echo ""
echo "📚 See DEPLOYMENT-AR.md for detailed Arabic guide"
echo "📚 See raqim-api/README.md for full English documentation"
