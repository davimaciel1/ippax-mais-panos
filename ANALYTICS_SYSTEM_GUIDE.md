# Sistema de Analytics e Tracking para Marketplaces - IPPAX

## Visão Geral

Este sistema completo de analytics e tracking foi desenvolvido para transformar o e-commerce IPPAX em uma landing page de afiliados com analytics avançado. O sistema rastreia cliques em marketplaces, captura dados detalhados dos usuários e integra com pixels de terceiros como Google Analytics 4 e UOL Ads.

## Arquitetura do Sistema

### 1. Backend (Node.js + Express + SQLite)

#### Tabelas do Banco de Dados

**marketplace_clicks** - Tabela principal para tracking de cliques:
- `id` - ID único do clique
- `marketplace` - Nome do marketplace (amazon, mercadolivre, etc.)
- `product_id` - ID do produto (referência)
- `product_name` - Nome do produto
- `user_id` - ID do usuário (baseado em session/cookie)
- `ip_address` - Endereço IP do usuário
- `user_agent` - User agent do navegador
- `referrer` - URL de referência
- `country`, `city` - Localização geográfica
- `device`, `browser`, `os` - Informações do dispositivo
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` - Parâmetros UTM
- `session_id` - ID da sessão
- `clicked_at` - Timestamp do clique

**analytics_daily** - Tabela de agregações diárias para performance:
- Agregações por data, marketplace e produto
- Contadores de cliques totais, únicos, mobile, desktop

#### APIs Implementadas

**POST /api/analytics/click** - Registrar clique em marketplace
```javascript
{
  "marketplace": "amazon",
  "productId": 123,
  "productName": "Piso Vinílico Carvalho",
  "redirectUrl": "https://amazon.com.br/dp/...",
  // outros campos são capturados automaticamente pelo middleware
}
```

**GET /api/analytics/dashboard** - Métricas do dashboard (requer autenticação)
- Parâmetros: startDate, endDate, marketplace, productId, device
- Retorna: resumo, top marketplaces, top produtos, estatísticas diárias

**GET /api/analytics/clicks** - Histórico detalhado (requer autenticação)
- Suporte a paginação e filtros
- Ideal para exportação de dados

**GET /api/analytics/marketplaces** - Performance comparativa por marketplace
- Estatísticas detalhadas por marketplace
- Tendências diárias por marketplace

### 2. Middleware de Tracking

O sistema inclui dois middlewares automáticos:

**trackingMiddleware** - Captura dados básicos de todas as requisições:
- Informações do dispositivo (mobile/desktop/tablet)
- Geolocalização básica
- Parâmetros UTM
- Session/User ID management via cookies

**marketplaceTrackingMiddleware** - Intercepta redirects para marketplaces:
- Detecta automaticamente redirects para marketplaces conhecidos
- Registra cliques automaticamente
- Integra com sistema de pixels

### 3. Integração com Pixels

**Google Analytics 4**:
- Eventos via Measurement Protocol
- Tracking de cliques em marketplaces
- Tracking de page views
- Dados enriquecidos com informações de dispositivo

**UOL Ads Pixel**:
- Eventos customizados para UOL Ads
- Tracking de conversões de afiliados
- Parâmetros UTM integrados

**Facebook Pixel** (bonus):
- Eventos de Purchase para cliques
- Eventos de PageView
- Dados de usuário anonimizados

## Frontend (React)

### 1. Hook useAnalyticsTracking

```typescript
const { trackMarketplaceClick, trackAndRedirect, getMarketplaceUrl } = useAnalyticsTracking();

// Rastrear um clique manualmente
await trackMarketplaceClick({
  marketplace: 'amazon',
  productId: 123,
  productName: 'Produto Teste'
});

// Rastrear e redirecionar automaticamente
await trackAndRedirect({
  marketplace: 'amazon',
  productId: 123,
  productName: 'Produto Teste',
  redirectUrl: 'https://amazon.com.br/dp/...'
});
```

### 2. Componentes de UI

**MarketplaceButtonWithTracking** - Botão com tracking integrado:
```jsx
<MarketplaceButtonWithTracking
  marketplace="amazon"
  productId={product.id}
  productName={product.name}
  productAsin="B0XXXXXXXX"
  utmParams={{ campaign: 'promocao_natal' }}
>
  Comprar na Amazon
</MarketplaceButtonWithTracking>
```

**MarketplaceComparison** - Grid de comparação de marketplaces:
```jsx
<MarketplaceComparison
  productId={product.id}
  productName={product.name}
  marketplaces={['amazon', 'mercadolivre', 'americanas']}
/>
```

**FeaturedMarketplaceButton** - Botão destacado com preço:
```jsx
<FeaturedMarketplaceButton
  marketplace="amazon"
  productId={product.id}
  productName={product.name}
  price="89.90"
  originalPrice="119.90"
  discount="25%"
/>
```

### 3. Dashboard de Analytics

Componente completo para administradores com:
- Métricas em tempo real
- Gráficos de tendências (Line Chart, Pie Chart)
- Tabelas de top produtos e marketplaces
- Filtros avançados por data, marketplace, dispositivo
- Exportação de dados em CSV
- Atualização automática

## Configuração

### 1. Variáveis de Ambiente

```env
# Google Analytics 4
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-ga4-api-secret

# UOL Ads Pixel
UOL_PIXEL_ID=your-uol-pixel-id
UOL_ACCESS_TOKEN=your-uol-access-token

# Facebook Pixel (opcional)
FACEBOOK_PIXEL_ID=your-facebook-pixel-id
FACEBOOK_ACCESS_TOKEN=your-facebook-access-token

# Rate Limiting
ANALYTICS_RATE_LIMIT=100
CLICK_RATE_LIMIT=50
```

### 2. Instalação de Dependências

```bash
npm install cookie-parser
npm install --save-dev @types/cookie-parser
```

### 3. Inicialização do Servidor

O sistema é automaticamente inicializado quando o servidor é iniciado:
- Tabelas do banco são criadas automaticamente
- Middlewares são aplicados globalmente
- Pixel manager é inicializado com configurações do ambiente

## Uso Prático

### 1. Implementação Básica

```jsx
// Em uma página de produto
import { MarketplaceButtonWithTracking } from '../components/marketplace-button-with-tracking';

function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <div className="marketplace-buttons">
        <MarketplaceButtonWithTracking
          marketplace="amazon"
          productId={product.id}
          productName={product.name}
          keywords={product.keywords}
        />
        <MarketplaceButtonWithTracking
          marketplace="mercadolivre"
          productId={product.id}
          productName={product.name}
          keywords={product.keywords}
        />
      </div>
    </div>
  );
}
```

### 2. Analytics Dashboard

```jsx
// Em uma página admin
import { AnalyticsDashboard } from '../components/admin/analytics-dashboard';

function AdminAnalytics() {
  return (
    <div>
      <h1>Analytics - Marketplaces</h1>
      <AnalyticsDashboard />
    </div>
  );
}
```

### 3. Tracking Manual

```jsx
// Para casos especiais onde você precisa de controle total
import { useAnalyticsTracking } from '../hooks/use-analytics-tracking';

function CustomButton({ product }) {
  const { trackMarketplaceClick } = useAnalyticsTracking();
  
  const handleClick = async () => {
    // Lógica customizada aqui
    
    // Rastrear o clique
    await trackMarketplaceClick({
      marketplace: 'custom',
      productId: product.id,
      productName: product.name
    });
    
    // Redirecionar manualmente
    window.open(customUrl, '_blank');
  };
  
  return <button onClick={handleClick}>Clique Customizado</button>;
}
```

## Funcionalidades Avançadas

### 1. Rate Limiting
- 100 requests/minuto para APIs de analytics
- 50 requests/minuto para tracking de cliques
- Configurável via variáveis de ambiente

### 2. Geolocalização
- Detecção básica de país/cidade por IP
- Extensível para usar serviços como MaxMind

### 3. Detecção de Dispositivos
- Parsing avançado de User-Agent
- Categorização em mobile/desktop/tablet
- Detecção de browser e sistema operacional

### 4. UTM Tracking
- Captura automática de parâmetros UTM
- Persistência através de sessões
- Integração com pixels externos

### 5. Session Management
- Cookies seguros para tracking
- IDs únicos para usuários anônimos
- Compatibilidade com LGPD

## Monitoramento e Debugging

### 1. Logs do Sistema
```javascript
// Logs automáticos para debug
console.log('Marketplace click recorded:', {
  marketplace: data.marketplace,
  product: data.productName,
  device: data.trackingData.device,
  timestamp: new Date().toISOString()
});
```

### 2. Health Check
```bash
curl http://localhost:5000/api/health
```

### 3. Teste das APIs
```bash
# Testar tracking de clique
curl -X POST http://localhost:5000/api/analytics/click \
  -H "Content-Type: application/json" \
  -d '{"marketplace": "amazon", "productName": "Teste", "productId": 1}'

# Testar dashboard (requer autenticação)
curl http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer your-jwt-token"
```

## Roadmap de Melhorias

### Curto Prazo
- [ ] Integração com mais marketplaces
- [ ] Métricas de conversão real (pós-clique)
- [ ] A/B testing para botões de marketplace

### Médio Prazo
- [ ] Machine Learning para otimização de cliques
- [ ] Integração com Google Tag Manager
- [ ] Dashboard público para parceiros

### Longo Prazo
- [ ] API pública para terceiros
- [ ] Análise de sentimento dos cliques
- [ ] Predição de conversões

## Suporte e Manutenção

Para questões técnicas:
1. Verificar logs do servidor
2. Testar APIs individualmente
3. Validar configurações de pixels
4. Verificar rate limits

Para problemas de performance:
1. Verificar índices do banco de dados
2. Monitorar agregações diárias
3. Otimizar queries de dashboard

Este sistema foi projetado para ser robusto, escalável e fácil de manter, proporcionando insights valiosos sobre o comportamento dos usuários em relação aos marketplaces parceiros.