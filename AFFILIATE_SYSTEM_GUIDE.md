# 🎯 Sistema de Afiliados IPPAX - Guia Completo

## 📋 Visão Geral

O Sistema de Afiliados IPPAX transforma o e-commerce tradicional em uma landing page de afiliados altamente otimizada, com tracking avançado e analytics detalhado para maximizar conversões através dos principais marketplaces.

### 🎯 Objetivos Principais
- **Maximizar conversões** através de múltiplos marketplaces
- **Tracking completo** de cliques e jornada do usuário
- **Retargeting avançado** com pixels customizáveis
- **Analytics detalhado** para otimização contínua
- **Interface administrativa** para gestão eficiente

---

## 🏗️ Arquitetura do Sistema

### **Frontend (React/TypeScript)**
```
client/src/
├── components/
│   ├── marketplace-button.tsx      # Botão individual de marketplace
│   ├── marketplace-grid.tsx        # Grid de todos os marketplaces
│   └── retargeting.ts             # Sistema de pixels
├── pages/admin/
│   └── affiliate-analytics.tsx    # Dashboard de analytics
└── lib/
    ├── analytics.ts               # Google Analytics + Facebook
    └── retargeting.ts            # Gerenciador de pixels
```

### **Backend (Node.js/Express)**
```
server/
├── routes/
│   └── affiliates.ts             # APIs de tracking e analytics
└── shared/
    └── schema-sqlite.ts           # Schema do banco de dados
```

### **Banco de Dados (SQLite)**
```sql
-- Tabelas principais
affiliate_clicks        # Tracking de cliques
marketplace_settings     # Configurações dos marketplaces
conversion_events       # Eventos de conversão
retargeting_pixels      # Configuração de pixels
```

---

## 🚀 Implementação Step-by-Step

### **FASE 1: Configuração Inicial**

#### 1.1 Variáveis de Ambiente
Adicione ao seu `.env`:

```bash
# Analytics
VITE_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID
VITE_FACEBOOK_PIXEL_ID=FB_PIXEL_ID
VITE_GOOGLE_ADS_PIXEL_ID=AW-XXXXXXXXX
VITE_UOL_ADS_PIXEL_ID=UOL_PIXEL_ID

# Database
DATABASE_URL=./database.sqlite
```

#### 1.2 Executar Migrações
```bash
npm run migrate
```

#### 1.3 Configurar Marketplaces
Acesse `/admin/affiliate-analytics` e configure:
- Links de afiliados
- Textos dos botões
- Cores e estilos
- Parâmetros de tracking

### **FASE 2: Configuração de Marketplaces**

#### 2.1 Amazon
```javascript
{
  id: "amazon",
  name: "Amazon",
  affiliateLink: "https://amzn.to/SEU_LINK_AQUI",
  buttonText: "Comprar na Amazon",
  colors: {
    primary: "#FF9900",
    secondary: "#FF6600", 
    text: "#FFFFFF"
  },
  trackingParams: {
    tag: "seu-tag-afiliado",
    ref: "ippax_affiliate"
  }
}
```

#### 2.2 Mercado Livre
```javascript
{
  id: "mercadolivre",
  name: "Mercado Livre",
  affiliateLink: "https://mercadolivre.com.br/SEU_LINK",
  buttonText: "Ver no Mercado Livre",
  colors: {
    primary: "#FFE600",
    secondary: "#FFC400",
    text: "#333333"
  },
  trackingParams: {
    source: "ippax",
    campaign: "affiliate"
  }
}
```

#### 2.3 Shopee
```javascript
{
  id: "shopee",
  name: "Shopee",
  affiliateLink: "https://shopee.com.br/SEU_LINK",
  buttonText: "Comprar na Shopee",
  colors: {
    primary: "#EE4D2D",
    secondary: "#D73211",
    text: "#FFFFFF"
  }
}
```

#### 2.4 Leroy Merlin
```javascript
{
  id: "leroymerlin",
  name: "Leroy Merlin",
  affiliateLink: "https://leroymerlin.com.br/SEU_LINK",
  buttonText: "Ver na Leroy Merlin",
  colors: {
    primary: "#00AA13",
    secondary: "#008F11",
    text: "#FFFFFF"
  }
}
```

### **FASE 3: Configuração de Pixels**

#### 3.1 Google Ads
```javascript
// Configuração automática via retargeting.ts
const googleAdsConfig = {
  type: 'google_ads',
  pixelId: 'AW-XXXXXXXXX',
  isActive: true,
  eventTypes: ['affiliate_click', 'conversion']
};
```

#### 3.2 UOL Ads
```javascript
const uolAdsConfig = {
  type: 'uol_ads',
  pixelId: 'SEU_PIXEL_UOL',
  isActive: true,
  eventTypes: ['pageview', 'click', 'conversion']
};
```

#### 3.3 Facebook Pixel
```javascript
const facebookConfig = {
  type: 'facebook',
  pixelId: 'SEU_PIXEL_FB',
  isActive: true,
  eventTypes: ['PageView', 'ViewContent', 'Lead']
};
```

---

## 📊 Analytics e Métricas

### **Métricas Principais**
- **Total de Cliques**: Soma de todos os cliques por marketplace
- **Taxa de Conversão**: Porcentagem de cliques que resultam em conversão
- **Receita Estimada**: Valor estimado gerado pelos afiliados
- **CTR Médio**: Click-through rate médio entre marketplaces

### **Segmentação Disponível**
- Por marketplace (Amazon, ML, Shopee, Leroy)
- Por dispositivo (Mobile, Desktop, Tablet)
- Por localização geográfica
- Por fonte de tráfego
- Por período temporal

### **Relatórios Automáticos**
- Relatório diário por email
- Relatório semanal com insights
- Relatório mensal com recomendações
- Alertas de performance

---

## 🎨 Customização da Interface

### **Variantes de Botões**
```tsx
// Padrão
<MarketplaceButton marketplace="amazon" variant="default" />

// Compacto
<MarketplaceButton marketplace="amazon" variant="compact" />

// Grande
<MarketplaceButton marketplace="amazon" variant="large" />
```

### **Layouts do Grid**
```tsx
// Grid responsivo
<MarketplaceGrid layout="grid" />

// Lista vertical
<MarketplaceGrid layout="list" />

// Carrossel horizontal
<MarketplaceGrid layout="carousel" />
```

### **Cores Personalizadas**
```css
:root {
  --marketplace-amazon: #FF9900;
  --marketplace-ml: #FFE600;
  --marketplace-shopee: #EE4D2D;
  --marketplace-leroy: #00AA13;
}
```

---

## 🔧 APIs Disponíveis

### **Tracking de Cliques**
```javascript
POST /api/affiliate/track-click
{
  "marketplace": "amazon",
  "productId": "123",
  "sessionId": "session_xyz",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://example.com"
}
```

### **Analytics por Marketplace**
```javascript
GET /api/affiliate/analytics/marketplace/amazon/details?period=30d
```

### **Configurações de Marketplace**
```javascript
GET /api/affiliate/marketplace/amazon/config
PUT /api/affiliate/marketplace/amazon/config
```

### **Pixels de Retargeting**
```javascript
GET /api/affiliate/retargeting/pixels
POST /api/affiliate/retargeting/track-event
```

---

## 🚦 Monitoramento e Saúde

### **Health Checks**
- Status do banco de dados
- Conectividade com APIs de terceiros
- Performance dos pixels
- Taxa de erro nas conversões

### **Alertas Configuráveis**
- Queda brusca no CTR
- Aumento significativo em cliques
- Falhas na configuração de pixels
- Problemas de conectividade

### **Logs Detalhados**
```javascript
// Exemplo de log de click
{
  "timestamp": "2025-01-15T10:30:00Z",
  "event": "affiliate_click",
  "marketplace": "amazon",
  "productId": "123",
  "sessionId": "session_xyz",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "country": "BR",
  "city": "São Paulo",
  "deviceType": "mobile",
  "browserName": "chrome"
}
```

---

## 🎯 Otimizações de Conversão

### **A/B Testing**
- Testes de cores dos botões
- Variações de texto
- Posicionamento na página
- Tamanhos dos botões

### **Estratégias de Conversão**
1. **Posicionamento Estratégico**: Botões após benefícios do produto
2. **Urgência**: Indicadores de estoque limitado
3. **Social Proof**: Contador de cliques
4. **Trust Signals**: Selos de segurança

### **Mobile Optimization**
- Botões com tamanho mínimo de 44px
- Loading states para conexões lentas
- Gestos de swipe para carrossel
- Layout responsivo

---

## 🔐 Segurança e Compliance

### **Proteções Implementadas**
- Rate limiting nas APIs
- Validação de entrada
- Sanitização de dados
- Headers de segurança

### **LGPD Compliance**
- Consentimento para cookies
- Anonimização de IPs
- Direito ao esquecimento
- Transparência nos dados coletados

### **Auditoria**
- Logs de todas as ações administrativas
- Histórico de mudanças de configuração
- Backup automático dos dados
- Monitoramento de acesso

---

## 🚀 Deploy e Produção

### **Variáveis de Produção**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SENTRY_DSN=https://...
```

### **Build Otimizado**
```bash
npm run build
npm run start
```

### **Monitoramento**
- Integração com Sentry para errors
- Métricas no Grafana
- Alertas no Slack
- Uptime monitoring

---

## 📈 Roadmap Futuro

### **Próximas Features**
- [ ] Integração com mais marketplaces
- [ ] Machine Learning para otimização
- [ ] API pública para terceiros
- [ ] Widget embarcável
- [ ] App mobile nativo

### **Melhorias Planejadas**
- [ ] Cache inteligente
- [ ] CDN para assets
- [ ] Microserviços
- [ ] GraphQL API
- [ ] Real-time analytics

---

## 📞 Suporte Técnico

### **Documentação Adicional**
- [API Reference](./API_REFERENCE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Performance Guide](./PERFORMANCE.md)

### **Contato**
- **Email**: dev@ippax.com.br
- **Slack**: #affiliate-system
- **GitHub**: Issues e PRs

---

**🎯 Sistema de Afiliados IPPAX - Maximizando Conversões com Tecnologia Avançada**