const fs = require('fs');
const path = require('path');

function findFiles(dir, extension = '.tsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (file.endsWith(extension) || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  
  return results;
}

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Pattern mais específico para lucide-react
    const lucidePattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s*["']lucide-react["']/g;
    
    if (lucidePattern.test(content)) {
      content = content.replace(lucidePattern, 'import { $1 } from "@/components/ui/optimized-icons"');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Substituído: ${filePath.replace(process.cwd() + '\\', '')}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

console.log('🚀 Procurando todos os arquivos com imports do lucide-react...\n');

// Buscar em client/src
const srcDir = path.join(process.cwd(), 'client', 'src');
const allFiles = findFiles(srcDir);

let totalReplaced = 0;

allFiles.forEach(file => {
  if (replaceInFile(file)) {
    totalReplaced++;
  }
});

console.log(`\n✅ Concluído! Substituídos ${totalReplaced} arquivos.`);

if (totalReplaced === 0) {
  console.log('🎉 Todos os imports já foram substituídos!');
} else {
  console.log('\n📝 Execute npm run build:client para testar');
}
