#!/bin/bash
set -e

echo "📦 Fetching Pulumi stack outputs..."

cd infrastructure

# Get Pulumi outputs as JSON
PULUMI_OUTPUTS=$(pulumi stack output --json)

# Extract values
USER_POOL_ID=$(echo "$PULUMI_OUTPUTS" | grep -o '"userPoolId":"[^"]*"' | cut -d'"' -f4)
USER_POOL_CLIENT_ID=$(echo "$PULUMI_OUTPUTS" | grep -o '"userPoolClientId":"[^"]*"' | cut -d'"' -f4)

cd ..

if [ -z "$USER_POOL_ID" ] || [ -z "$USER_POOL_CLIENT_ID" ]; then
  echo "❌ Error: Could not fetch Cognito configuration from Pulumi"
  echo "Make sure you've deployed the infrastructure with 'pulumi up'"
  exit 1
fi

echo "✅ Configuration loaded:"
echo "   USER_POOL_ID: $USER_POOL_ID"
echo "   CLIENT_ID: $USER_POOL_CLIENT_ID"

echo "🔨 Building Next.js app with configuration..."

# Export environment variables for Next.js build
export NEXT_PUBLIC_COGNITO_USER_POOL_ID="$USER_POOL_ID"
export NEXT_PUBLIC_COGNITO_CLIENT_ID="$USER_POOL_CLIENT_ID"

# Run Next.js build
npm run build

echo "✅ Build complete!"
