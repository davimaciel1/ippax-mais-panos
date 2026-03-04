# Sistema de Marketplace IPPAX

Sistema completo de interface frontend para marketplaces com tracking avançado, pixels de retargeting e otimização de conversão.

## 🚀 Características Principais

### ✅ Componentes Implementados
- **MarketplaceButton**: Componente base reutilizável
- **AmazonButton**: Botão específico para Amazon
- **MercadoLivreButton**: Botão específico para Mercado Livre  
- **ShopeeButton**: Botão específico para Shopee
- **LeroyMerlinButton**: Botão específico para Leroy Merlin
- **MarketplaceSection**: Seção completa organizacional
- **MarketplaceSettings**: Painel administrativo

### ✅ Sistema de Tracking
- **Google Analytics 4**: Eventos customizados de marketplace
- **Facebook Pixel**: Tracking de conversão e retargeting
- **Google Ads**: Pixels de conversão e remarketing
- **UOL Ads**: Suporte para plataforma brasileira

### ✅ Otimizações Implementadas
- **Design Responsivo**: Mobile-first approach
- **Acessibilidade**: WCAG compliance
- **A/B Testing**: Sistema automático de otimização
- **Performance**: Tracking otimizado e lazy loading

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── marketplace-button.tsx          # Componente base
│   ├── marketplace-configs.tsx         # Configurações dos marketplaces
│   ├── marketplace-section.tsx         # Seção completa
│   ├── marketplace-demo.tsx            # Exemplo de uso
│   ├── amazon-button.tsx               # Botão Amazon
│   ├── mercadolivre-button.tsx         # Botão Mercado Livre
│   ├── shopee-button.tsx               # Botão Shopee
│   ├── leroymerlin-button.tsx          # Botão Leroy Merlin
│   └── admin/
│       └── marketplace-settings.tsx    # Painel administrativo
├── hooks/
│   └── use-marketplace-optimization.tsx # Hook de otimização
├── lib/
│   ├── analytics.ts                    # Sistema de analytics
│   └── ab-testing.ts                   # Sistema de A/B testing
```

## 🔧 Configuração Inicial

### 1. Instalar Dependências
O projeto já inclui as dependências necessárias:
- `framer-motion` - Animações
- `lucide-react` - Ícones
- `tailwindcss` - Estilização

### 2. Configurar Analytics
```typescript
import { initializeAnalytics } from "@/lib/analytics";

// Inicializar no App.tsx ou componente principal
initializeAnalytics(
  'GA_MEASUREMENT_ID',    // Google Analytics 4
  'FACEBOOK_PIXEL_ID',    // Facebook Pixel  
  'GOOGLE_ADS_ID',        // Google Ads
  'UOL_ADS_ID'           // UOL Ads (opcional)
);
```

### 3. Configurar Links de Afiliado
```typescript
// Acesse /admin/marketplace-settings ou configure diretamente:
import { saveMarketplaceSettings } from "@/components/marketplace-configs";

saveMarketplaceSettings({
  amazon: {
    enabled: true,
    affiliateLink: "https://amzn.to/seu-link",
    displayName: "Amazon"
  },
  mercadolivre: {
    enabled: true, 
    affiliateLink: "https://produto.mercadolivre.com.br/seu-link",
    displayName: "Mercado Livre"
  }
  // ... outros marketplaces
});
```

## 📱 Como Usar os Componentes

### Seção Completa de Marketplace
```tsx
import MarketplaceSection from "@/components/marketplace-section";

<MarketplaceSection
  productId="produto-123"
  productName="Piso Vinílico Premium"
  showTitle={true}
  showBenefits={true}
  variant="default"        // 'default' | 'compact' | 'minimal'
  layout="grid"           // 'grid' | 'stack' | 'horizontal'
/>
```

### Botões Individuais
```tsx
import AmazonButton from "@/components/amazon-button";
import MercadoLivreButton from "@/components/mercadolivre-button";

<AmazonButton 
  productId="produto-123"
  productName="Piso Vinílico Premium"
  variant="compact"
/>
```

### Uso no Painel Admin
```tsx
import MarketplaceSettings from "@/components/admin/marketplace-settings";

// No painel administrativo
<MarketplaceSettings />
```

## 📊 Sistema de Analytics

### Eventos Rastreados Automaticamente

1. **marketplace_click**: Clique em botão de marketplace
2. **marketplace_impression**: Visualização de botão
3. **marketplace_section_viewed**: Visualização da seção
4. **ab_test_conversion**: Conversão em teste A/B

### Dados Customizados Enviados
```typescript
{
  marketplace: "amazon",
  product_id: "produto-123", 
  product_name: "Piso Vinílico",
  device_type: "mobile|desktop",
  high_contrast: boolean,
  reduced_motion: boolean,
  ab_layout: "grid|stack|horizontal",
  ab_button_style: "default|compact",
  ab_order: "default|popular-first|conversion-optimized"
}
```

## 🧪 Sistema de A/B Testing

### Testes Implementados

1. **marketplace-layout**: Grid vs Stack vs Horizontal
2. **button-style**: Default vs Compact  
3. **marketplace-order**: Ordem dos botões baseada em performance

### Visualizar Resultados
```typescript
import { abTesting } from "@/lib/ab-testing";

// Ver resultados de um teste
const results = abTesting.getResults('marketplace-layout');

// Ver todos os resultados
const allResults = abTesting.getAllResults();

// Verificar significância estatística
const isSignificant = abTesting.isStatisticallySignificant('marketplace-layout');
```

## 🎯 Pixels de Retargeting

### Audiences Criadas Automaticamente
- `marketplace_section_viewed`: Usuários que viram a seção
- `marketplace_impression`: Usuários que viram botões específicos
- `product_interest`: Interesse em categoria de produto
- `amazon_interested`: Interesse específico em Amazon
- `abandoned_cart`: Carrinho abandonado (se implementado)

### Usar Pixels Customizados
```typescript
import { retargetingPixels } from "@/lib/analytics";

// Criar audience customizada
retargetingPixels.fireAudience('custom_audience', {
  product_category: 'vinyl_flooring',
  price_range: 'premium',
  user_segment: 'b2b'
});
```

## 📱 Otimizações Responsivas

### Breakpoints Utilizados
- **Mobile**: < 768px - Layout stack, botões compactos
- **Tablet**: 768px - 1024px - Layout grid 2 colunas  
- **Desktop**: > 1024px - Layout grid 2-4 colunas

### Acessibilidade
- **WCAG Compliance**: Contraste, navegação por teclado
- **Screen Readers**: Labels adequados e descrições
- **Reduced Motion**: Respeita preferência do usuário
- **High Contrast**: Suporte automático

## 🔍 Monitoramento e Debug

### Console Logs Implementados
```javascript
// Analytics tracking confirmado
console.log('Google Ads conversion tracked for amazon');

// A/B testing status  
console.log('AB Test variant assigned:', variant);

// Erros de configuração
console.error('No analytics IDs configured');
```

### Verificar Tracking
1. Abra DevTools → Network
2. Procure requests para:
   - `google-analytics.com`
   - `facebook.com/tr`
   - `googleadservices.com`

## 🚀 Deploy em Produção

### Checklist Pré-Deploy
- [ ] Configurar IDs reais de analytics
- [ ] Testar todos os links de afiliado
- [ ] Configurar domínios nos pixels  
- [ ] Remover logs de debug
- [ ] Testar responsividade em dispositivos reais
- [ ] Validar acessibilidade com screen readers

### Variáveis de Ambiente
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXX  
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
VITE_UOL_ADS_ID=XXXXXXXXXX
```

## 📈 Métricas de Sucesso

### KPIs para Monitorar
1. **CTR por Marketplace**: Taxa de clique por plataforma
2. **Conversão por Variante**: Performance dos testes A/B
3. **Device Performance**: Mobile vs Desktop
4. **Bounce Rate**: Taxa de abandono na seção
5. **Revenue Attribution**: Receita por marketplace

### Dashboards Recomendados
- Google Analytics 4: Eventos customizados
- Facebook Ads Manager: Conversões e retargeting
- Google Ads: Remarketing audiences
- Painel interno: Resultados A/B testing

## 🆘 Troubleshooting

### Botões Não Aparecem
1. Verificar se `enabled: true` na configuração
2. Confirmar links de afiliado válidos
3. Checar console por erros JavaScript

### Analytics Não Funcionam
1. Verificar IDs corretos nas variáveis de ambiente
2. Confirmar domínio autorizado nos pixels
3. Testar em modo incógnito para evitar ad blockers

### A/B Testing Não Ativo
1. Verificar datas de início/fim dos testes
2. Confirmar `isActive: true` na configuração
3. Limpar localStorage em caso de erro

## 👥 Suporte

Para dúvidas sobre implementação ou bugs:
1. Verificar logs do console do navegador
2. Conferir este README para configurações
3. Contactar o desenvolvedor responsável

---

**Desenvolvido para IPPAX Pisos Vinílicos**  
Sistema completo de marketplace com foco em conversão e performance.