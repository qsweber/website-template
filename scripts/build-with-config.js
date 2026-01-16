#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

console.log("📦 Fetching Pulumi stack outputs...");

try {
  // Get Pulumi outputs
  const outputs = JSON.parse(
    execSync("pulumi stack output --json", {
      cwd: path.join(__dirname, "..", "infrastructure"),
      encoding: "utf8",
    }),
  );

  const userPoolId = outputs.userPoolId;
  const userPoolClientId = outputs.userPoolClientId;

  if (!userPoolId || !userPoolClientId) {
    console.error("❌ Error: Could not fetch Cognito configuration from Pulumi");
    console.error("Make sure you've deployed the infrastructure with 'pulumi up'");
    process.exit(1);
  }

  console.log("✅ Configuration loaded:");
  console.log(`   USER_POOL_ID: ${userPoolId}`);
  console.log(`   CLIENT_ID: ${userPoolClientId}`);

  console.log("🔨 Building Next.js app with configuration...");

  // Build with environment variables
  execSync("npm run build", {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: userPoolId,
      NEXT_PUBLIC_COGNITO_CLIENT_ID: userPoolClientId,
    },
  });

  console.log("✅ Build complete!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
