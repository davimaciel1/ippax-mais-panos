// Script para substituir imports do lucide-react pelos ícones otimizados
const fs = require('fs');
const path = require('path');

// Lista de arquivos importantes para substituir primeiro
const priorityFiles = [
  'client/src/pages/not-found.tsx',
  'client/src/pages/sobre.tsx',
  'client/src/pages/contato.tsx',
  'client/src/pages/blog.tsx',
  'client/src/pages/blog-post.tsx',
  'client/src/pages/account.tsx'
];

const lucidePattern = /import\s+{([^}]+)}\s+from\s+["']lucide-react["']/g;

function replaceInFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let hasLucide = lucidePattern.test(content);
    
    if (!hasLucide) {
      return false; // Não tem imports do lucide-react
    }

    // Reset regex
    lucidePattern.lastIndex = 0;
    
    const newContent = content.replace(lucidePattern, 'import {$1} from "@/components/ui/optimized-icons"');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Substituído: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

console.log('🚀 Iniciando substituição de imports do lucide-react...\n');

let totalReplaced = 0;

// Substituir arquivos prioritários primeiro
priorityFiles.forEach(file => {
  if (replaceInFile(file)) {
    totalReplaced++;
  }
});

console.log(`\n✅ Substituição concluída! Total de arquivos modificados: ${totalReplaced}`);

if (totalReplaced > 0) {
  console.log('\n📝 Próximos passos:');
  console.log('1. Executar npm run build:client para verificar se há ícones faltantes');
  console.log('2. Adicionar ícones faltantes ao optimized-icons.tsx se necessário');
  console.log('3. Executar testes para garantir que tudo funciona');
}
