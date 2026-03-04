# IPPAX E-commerce - Documentação Claude

## Visão Geral

Aplicação e-commerce completa para IPPAX, empresa premium de pisos vinílicos. Sistema full-stack com React/TypeScript no frontend e Node.js/Express/PostgreSQL no backend, otimizado para Google Shopping e com painel administrativo completo.

## Alterações Recentes (18 de Julho de 2025)

### Sistema Completo de E-commerce Implementado

- **Schema de Banco de Dados Completo com Google Shopping**:
  - Adicionados TODOS os campos obrigatórios e recomendados do Google Shopping
  - Campos de identificação: GTIN, MPN, marca, condição
  - Campos de categorização: googleCategory, productType, customLabels (0-4)
  - Campos de preço: price, salePrice com datas de início/fim
  - Campos físicos: peso, dimensões, dimensões de envio
  - Campos de disponibilidade: availability, availabilityDate, minHandlingTime, maxHandlingTime
  - Campos adicionais: ageGroup, gender, itemGroupId, energyEfficiencyClass
  - Campos de frete e impostos: shipping (JSONB), shippingLabel, tax (JSONB), taxCategory
  - SEO completo: metaTitle, metaDescription, urlSlug, canonicalUrl
  - Features: highlights (JSONB), technicalSpecs (JSONB)

- **Novas Tabelas Implementadas**:
  - **orders**: Sistema completo de pedidos com endereços completos, status de pagamento, tracking
  - **orderItems**: Itens do pedido com snapshot de produto
  - **coupons**: Sistema de cupons de desconto
  - **shippingZones**: Zonas de entrega por estado
  - **shippingMethods**: Métodos de envio com cálculo dinâmico
  - **productReviews**: Avaliações de produtos
  - **inventoryMovements**: Controle de estoque detalhado
  - **settings**: Configurações do sistema

- **Formulário de Produtos Completo (product-edit-complete.tsx)**:
  - Interface com 6 abas: Básico, Detalhes, Mídia, Google Shopping, Frete, SEO
  - Validação em tempo real de campos obrigatórios
  - Score de conformidade do Google Shopping (0-100%)
  - Preview de SEO mostrando como aparece no Google
  - Sistema de highlights e especificações técnicas
  - Upload de múltiplas imagens com drag & drop
  - Campos de frete completos com dimensões da embalagem
  - Custom labels para segmentação em campanhas
  - Auto-geração de slug e meta tags

- **Sistema de Pedidos Completo (orders-complete.tsx)**:
  - Dashboard com estatísticas: total, pendentes, enviados, receita
  - Filtros por status, busca por número/cliente/email
  - Visualização detalhada do pedido em modal
  - Timeline do pedido mostrando histórico
  - Ações: atualizar status, enviar email, imprimir, gerar NF
  - Informações completas: cliente, endereço, itens, pagamento
  - Sistema de tracking de envio
  - Exportação de relatórios

### Correções de Autenticação e Roteamento

- **Contexto de Autenticação Melhorado**:
  - Adicionado estado `isLoading` para evitar redirecionamentos prematuros
  - Corrigido bug de carregamento do usuário do localStorage
  - Admin dashboard agora aguarda autenticação carregar antes de verificar permissões

- **Rotas Mock de Autenticação**:
  - Criadas rotas `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
  - Sistema mockado para desenvolvimento local
  - Suporte a tokens mock para simular autenticação

### Estrutura de Arquivos Atualizada

```
client/src/
├── pages/admin/
│   ├── dashboard.tsx (atualizado com loading state)
│   ├── product-edit-complete.tsx (novo - formulário completo)
│   ├── orders-complete.tsx (novo - gestão de pedidos)
│   ├── orders.tsx (versão anterior)
│   └── product-edit.tsx (versão anterior)
├── contexts/
│   └── auth-context.tsx (atualizado com isLoading)
└── pages/
    ├── test-admin.tsx (página de teste)
    └── admin-debug.tsx (página de debug)

server/
├── routes.ts (atualizado com rotas mock de auth)
└── index.ts (configurado com dotenv)

shared/
└── schema.ts (schema completo com todas as tabelas)
```

## Configuração do Ambiente

### Variáveis de Ambiente (.env)
```
SESSION_SECRET=[GERAR_NOVA_CHAVE_SEGURA_MIN_64_CHARS]
DATABASE_URL=postgresql://[usuario]:[senha]@[host]/[database]?sslmode=require
PGDATABASE=[database_name]
PGHOST=[database_host]
PGPORT=5432
PGUSER=[database_user]
PGPASSWORD=[database_password]
```

**IMPORTANTE**: Nunca commitar credenciais reais. Use variáveis de ambiente ou gerenciadores de segredos.

### Como Executar

1. **Instalar dependências**:
   ```bash
   cd VinylFloorMarket/VinylFloorMarket
   npm install
   ```

2. **Executar o servidor**:
   ```bash
   npm run dev
   # ou
   npx tsx server/index.ts
   ```

3. **Acessar o admin**:
   - URL: http://localhost:5000/admin/dashboard
   - Configure usuário admin no localStorage:
   ```javascript
   localStorage.setItem("user", JSON.stringify({
     id: 1,
     name: "Admin",
     email: "admin@example.com"
   }));
   ```

## Funcionalidades Implementadas

### Google Shopping Compliance
- ✅ Todos os campos obrigatórios do Google Shopping
- ✅ Validação de GTIN/MPN
- ✅ Categorias Google com taxonomia oficial
- ✅ Custom labels para campanhas
- ✅ Imagens com requisitos mínimos
- ✅ Disponibilidade e estoque em tempo real
- ✅ Informações de frete completas
- ✅ Score de conformidade visual

### Sistema de Pedidos
- ✅ Criação e gestão de pedidos
- ✅ Status de pedido e pagamento separados
- ✅ Endereços de cobrança e entrega
- ✅ Cálculo de frete e impostos
- ✅ Tracking de envio
- ✅ Timeline do pedido
- ✅ Integração com transportadoras (preparado)

### Gestão de Produtos
- ✅ CRUD completo de produtos
- ✅ Upload de múltiplas imagens
- ✅ Variações de produtos (itemGroupId)
- ✅ Preços promocionais com datas
- ✅ Controle de estoque
- ✅ SEO otimizado

### Recursos Administrativos
- ✅ Dashboard com métricas
- ✅ Gestão de pedidos
- ✅ Gestão de produtos
- ✅ Sistema de cupons (schema pronto)
- ✅ Configurações do sistema
- ✅ Relatórios e exportação

## Próximos Passos

1. **Implementar Upload de Imagens Real**
2. **Criar Sistema de Frete Dinâmico**
3. **Implementar Gestão de Estoque Automática**
4. **Criar Feed XML para Google Shopping**
5. **Adicionar Dashboard de Analytics**
6. **Implementar Sistema de Avaliações**
7. **Criar API de Integração com Transportadoras**
8. **Implementar Sistema de Notificações**

## Observações Importantes

- Sistema de autenticação está mockado para desenvolvimento
- Uploads de imagem precisam de implementação real
- Integração com gateway de pagamento pendente
- Sistema preparado para multi-idioma mas apenas pt-BR implementado
- Schema permite B2B mas interface focada em B2C

## Stack Tecnológico

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (React Query)
- Wouter (routing)
- date-fns (datas)
- Lucide React (ícones)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (Neon)
- Drizzle ORM
- Zod (validação)

### Infraestrutura
- Vite (build)
- ESBuild (bundling)
- Docker ready
- Vercel/Netlify compatible