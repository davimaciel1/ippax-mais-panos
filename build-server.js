const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  try {
    // Create dist directory if it doesn't exist
    const distDir = path.join(__dirname, 'dist', 'server');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    await esbuild.build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node20',
      outfile: 'dist/server/index.js',
      external: [
        'better-sqlite3',
        'sharp',
        'bcryptjs',
        '@neondatabase/serverless',
        'multer'
      ],
      sourcemap: true,
      minify: false,
      format: 'cjs',
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx'
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    console.log('✅ Server build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();