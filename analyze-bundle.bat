@echo off
echo Setting environment variables for bundle analysis...
set ANALYZE_BUNDLE=true
set NODE_ENV=production

echo Building with bundle analysis...
npm run build:client

echo Checking for bundle analyzer output...
if exist "dist\bundle-analyzer.html" (
    echo ✅ Bundle analyzer report generated at dist/bundle-analyzer.html
    start dist\bundle-analyzer.html
) else (
    echo ❌ Bundle analyzer report not found
)
