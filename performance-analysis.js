#!/usr/bin/env node

/**
 * 🚀 ANÁLISE DE PERFORMANCE - IPPAX PISOS
 * Análise completa de bundle size, imports e otimizações
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 INICIANDO ANÁLISE DE PERFORMANCE...\n');

// Função para analisar tamanho dos arquivos
function analyzeFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      sizeKB: Math.round(stats.size / 1024),
      sizeMB: Math.round(stats.size / 1024 / 1024 * 100) / 100
    };
  } catch (error) {
    return null;
  }
}

// Função para analisar imports em arquivos
function analyzeImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Encontrar todos os imports
    const importRegex = /import\s+(?:.*?)\s+from\s+['"](.+?)['"]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    // Categorizar imports
    const categories = {
      react: imports.filter(imp => imp.includes('react')),
      ui: imports.filter(imp => imp.includes('@radix-ui') || imp.includes('lucide-react')),
      motion: imports.filter(imp => imp.includes('framer-motion')),
      heavy: imports.filter(imp => 
        imp.includes('recharts') || 
        imp.includes('@dnd-kit') || 
        imp.includes('react-dropzone')
      ),
      internal: imports.filter(imp => imp.startsWith('@/') || imp.startsWith('./')),
      external: imports.filter(imp => 
        !imp.startsWith('@/') && 
        !imp.startsWith('./') && 
        !imp.includes('react') &&
        !imp.includes('@radix-ui') &&
        !imp.includes('framer-motion') &&
        !imp.includes('lucide-react')
      )
    };
    
    return { imports, categories, totalImports: imports.length };
  } catch (error) {
    return null;
  }
}

// Analisar componentes principais
const componentPaths = [
  'client/src/App.tsx',
  'client/src/pages/home.tsx',
  'client/src/components/navigation.tsx',
  'client/src/components/product-hero.tsx',
  'client/src/components/marketplace-section.tsx'
];

console.log('📊 ANÁLISE DE COMPONENTES PRINCIPAIS:\n');

componentPaths.forEach(componentPath => {
  const fullPath = path.join(__dirname, componentPath);
  const fileSize = analyzeFileSize(fullPath);
  const importAnalysis = analyzeImports(fullPath);
  
  if (fileSize && importAnalysis) {
    console.log(`📁 ${componentPath}`);
    console.log(`   📏 Tamanho: ${fileSize.sizeKB}KB`);
    console.log(`   📦 Total Imports: ${importAnalysis.totalImports}`);
    console.log(`   ⚛️  React: ${importAnalysis.categories.react.length}`);
    console.log(`   🎨 UI Components: ${importAnalysis.categories.ui.length}`);
    console.log(`   🎭 Framer Motion: ${importAnalysis.categories.motion.length}`);
    console.log(`   ⚠️  Heavy Imports: ${importAnalysis.categories.heavy.length}`);
    
    if (importAnalysis.categories.heavy.length > 0) {
      console.log(`      ${importAnalysis.categories.heavy.join(', ')}`);
    }
    console.log('');
  }
});

// Analisar node_modules
console.log('📦 ANÁLISE DE DEPENDÊNCIAS PESADAS:\n');

const heavyDependencies = [
  'node_modules/react',
  'node_modules/react-dom',
  'node_modules/framer-motion',
  'node_modules/@radix-ui',
  'node_modules/lucide-react',
  'node_modules/recharts',
  'node_modules/@dnd-kit'
];

heavyDependencies.forEach(dep => {
  const depPath = path.join(__dirname, dep);
  if (fs.existsSync(depPath)) {
    try {
      const stats = fs.statSync(depPath);
      if (stats.isDirectory()) {
        // Calcular tamanho da pasta
        let totalSize = 0;
        function calculateDirSize(dirPath) {
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory()) {
              calculateDirSize(filePath);
            } else {
              totalSize += fileStat.size;
            }
          });
        }
        
        calculateDirSize(depPath);
        const sizeMB = Math.round(totalSize / 1024 / 1024 * 100) / 100;
        console.log(`📦 ${dep.replace('node_modules/', '')}: ${sizeMB}MB`);
      }
    } catch (error) {
      console.log(`⚠️ Erro ao analisar ${dep}`);
    }
  }
});

console.log('\n🎯 RECOMENDAÇÕES DE OTIMIZAÇÃO:\n');

// Recomendações baseadas na análise
const recommendations = [
  {
    category: '🚀 Code Splitting',
    items: [
      'Implementar lazy loading para rotas admin',
      'Separar chunks por funcionalidade (admin, blog, checkout)',
      'Lazy load de componentes pesados (charts, dropzone)',
      'Dynamic imports para marketplace components'
    ]
  },
  {
    category: '📦 Bundle Optimization',
    items: [
      'Tree shaking para @radix-ui (importar apenas componentes usados)',
      'Otimizar imports do Framer Motion',
      'Bundle analyzer para identificar duplicações',
      'Considerar alternatives menores para bibliotecas pesadas'
    ]
  },
  {
    category: '🖼️ Assets Optimization',
    items: [
      'Implementar lazy loading para imagens',
      'Converter imagens para WebP/AVIF',
      'Implementar responsive images',
      'CDN para assets estáticos'
    ]
  },
  {
    category: '⚡ Runtime Performance',
    items: [
      'React.memo para componentes puros',
      'useMemo/useCallback para cálculos pesados',
      'Virtual scrolling para listas grandes',
      'Debounce para inputs de busca'
    ]
  },
  {
    category: '📱 Core Web Vitals',
    items: [
      'Preload de fonts críticas',
      'Otimizar CLS com skeleton loading',
      'Reduce FID com smaller JS bundles',
      'Improve LCP com resource hints'
    ]
  }
];

recommendations.forEach(rec => {
  console.log(`${rec.category}:`);
  rec.items.forEach(item => console.log(`  • ${item}`));
  console.log('');
});

console.log('🔍 PRÓXIMOS PASSOS:\n');
console.log('1. npm run build -- --analyze (para bundle analyzer)');
console.log('2. Implementar lazy loading de rotas');
console.log('3. Otimizar imports de bibliotecas UI');
console.log('4. Configurar resource hints');
console.log('5. Implementar service worker para caching');

console.log('\n✅ Análise concluída!');
