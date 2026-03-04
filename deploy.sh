#!/bin/bash

# IPPAX E-commerce Deployment Script
# Este script prepara e faz o deploy do projeto IPPAX

echo "🚀 Iniciando deploy do IPPAX E-commerce..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "package.json não encontrado. Execute este script no diretório raiz do projeto."
    exit 1
fi

# 1. Limpar arquivos antigos
log "Limpando arquivos de build anteriores..."
rm -rf dist/
rm -rf node_modules/.vite/

# 2. Instalar dependências
log "Instalando dependências..."
npm ci --silent

# 3. Executar testes/verificações
log "Verificando projeto..."

# Verificar se todas as dependências estão instaladas
if ! npm list --depth=0 > /dev/null 2>&1; then
    warn "Algumas dependências podem estar faltando"
fi

# 4. Build de produção
log "Executando build de produção..."
if ! npm run build; then
    error "Build falhou. Verifique os erros acima."
    exit 1
fi

# 5. Verificar se o build foi bem-sucedido
if [ ! -d "dist/public" ]; then
    error "Diretório dist/public não foi criado. Build falhou."
    exit 1
fi

# 6. Verificar tamanho dos arquivos
log "Verificando tamanho dos arquivos..."
find dist/public -name "*.js" -size +1M -exec echo "⚠️  Arquivo grande encontrado: {}" \;

# 7. Preparar para deploy
log "Preparando arquivos para deploy..."

# Criar arquivo de configuração para servidor web
cat > dist/public/.htaccess << 'EOF'
# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# SPA routing
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
EOF

# Criar arquivo de configuração Nginx
cat > dist/nginx.conf << 'EOF'
server {
    listen 80;
    server_name ippax.com.br www.ippax.com.br;
    
    root /var/www/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (ajustar conforme necessário)
    location /api/ {
        proxy_pass http://localhost:45007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 8. Criar informações sobre o deploy
cat > dist/deploy-info.txt << EOF
IPPAX E-commerce Deploy Info
=============================
Data do Deploy: $(date)
Versão: $(node -p "require('./package.json').version")
Node.js: $(node --version)
NPM: $(npm --version)

Arquivos principais:
- Frontend: dist/public/
- Servidor: server/
- Banco de dados: SQLite (server/db.sqlite)

Variáveis de ambiente necessárias:
- PORT (padrão: 45007)
- SESSION_SECRET
- DATABASE_URL (para PostgreSQL) ou usar SQLite
- NODE_ENV=production

Comandos para iniciar:
1. Frontend: Servir arquivos em dist/public/
2. Backend: node server/index.js ou npm run server

URLs importantes:
- Frontend: http://localhost:7173
- API Backend: http://localhost:45007
- Admin: /admin/dashboard
EOF

# 9. Instruções finais
log "✅ Deploy preparado com sucesso!"
echo ""
echo "📁 Arquivos de deploy:"
echo "   - Frontend: dist/public/"
echo "   - Backend: server/"
echo "   - Configurações: dist/nginx.conf, dist/public/.htaccess"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Fazer upload dos arquivos em dist/public/ para o servidor web"
echo "   2. Configurar o servidor Node.js com os arquivos em server/"
echo "   3. Configurar as variáveis de ambiente"
echo "   4. Iniciar o servidor backend: npm run server"
echo ""
echo "🔧 Para desenvolvimento local:"
echo "   npm run dev"
echo ""
echo "📋 Checklist de deploy:"
echo "   □ Upload do frontend (dist/public/)"
echo "   □ Configuração do servidor Node.js"
echo "   □ Variáveis de ambiente configuradas"
echo "   □ Banco de dados configurado"
echo "   □ SSL/HTTPS configurado"
echo "   □ DNS configurado"
echo ""

# 10. Verificação final
if [ -f "dist/public/index.html" ] && [ -f "server/index.ts" ]; then
    log "✅ Todos os arquivos necessários estão presentes"
else
    error "❌ Alguns arquivos essenciais estão faltando"
    exit 1
fi

echo "🎉 Deploy do IPPAX E-commerce concluído!"