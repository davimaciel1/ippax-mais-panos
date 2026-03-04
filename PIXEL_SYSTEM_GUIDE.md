# Sistema de Pixels - IPPAX E-commerce

## Visão Geral

O sistema de pixels permite configurar e gerenciar pixels de rastreamento diretamente através do painel administrativo. Suporta Google Analytics 4, Meta Pixel (Facebook) e UOL Ads, além de códigos personalizados.

## Funcionalidades

### ✅ Recursos Implementados

1. **Painel Administrativo**
   - Interface intuitiva para configurar pixels
   - Ativação/desativação individual de cada pixel
   - Campos específicos para cada ID de pixel
   - Área para códigos personalizados
   - Status visual dos pixels configurados

2. **Banco de Dados**
   - Tabela `retargeting_pixels` para armazenar configurações
   - Tabela `site_settings` para configurações gerais
   - Dados padrão criados automaticamente

3. **API Backend**
   - Endpoints para listar, salvar e carregar configurações
   - Validação e tratamento de erros
   - Suporte a SQLite

4. **Componente de Rastreamento**
   - Injeção automática dos pixels configurados
   - Funções helper para eventos de e-commerce
   - Suporte a eventos customizados

## Como Usar

### 1. Configuração no Admin

1. Acesse `/admin/settings`
2. Vá para a aba "Pixels"
3. Ative os pixels desejados usando os switches
4. Insira os IDs fornecidos pelas plataformas:
   - **Google Analytics**: `G-XXXXXXXXXX`
   - **Meta Pixel**: `XXXXXXXXXXXXXXXX`
   - **UOL Ads**: `uol_pixel_id`
5. Adicione códigos personalizados se necessário
6. Clique em "Salvar"

### 2. Como Obter os IDs dos Pixels

#### Google Analytics 4
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Selecione sua propriedade
3. Vá em Administrador > Propriedade > Fluxos de dados
4. Selecione seu fluxo de dados da web
5. Copie o ID de medição (formato: G-XXXXXXXXXX)

#### Meta Pixel (Facebook)
1. Acesse [Business Manager](https://business.facebook.com/)
2. Vá em Ferramentas > Eventos > Pixels
3. Selecione ou crie um pixel
4. Copie o ID do pixel (16 dígitos)

#### UOL Ads
1. Acesse o painel do UOL Ads
2. Vá em Configurações > Pixel
3. Copie o ID do pixel fornecido

### 3. Eventos Rastreados Automaticamente

O sistema rastreia automaticamente os seguintes eventos:

- **PageView**: Visualização de página
- **ViewContent**: Visualização de produto
- **AddToCart**: Adição ao carrinho
- **InitiateCheckout**: Início do checkout
- **Purchase**: Compra realizada

### 4. Usando Eventos Personalizados

```typescript
import { ecommerceEvents, trackEvent } from "@/components/tracking-pixels";

// Evento de visualização de produto
ecommerceEvents.viewProduct(
  "produto-123",
  "Piso Vinílico Carvalho",
  "Piso Vinílico",
  89.90
);

// Evento de adição ao carrinho
ecommerceEvents.addToCart(
  "produto-123",
  "Piso Vinílico Carvalho",
  "Piso Vinílico",
  89.90,
  2
);

// Evento customizado para todos os pixels
trackEvent.all("custom_event", {
  category: "engagement",
  action: "scroll",
  value: 75
});

// Evento específico por plataforma
trackEvent.ga("custom_event", { /* parâmetros */ });
trackEvent.meta("CustomEvent", { /* parâmetros */ });
trackEvent.uol("custom_event", { /* parâmetros */ });
```

## Estrutura do Banco de Dados

### Tabela `retargeting_pixels`
```sql
CREATE TABLE retargeting_pixels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pixel_type TEXT NOT NULL,           -- 'google_analytics', 'meta_pixel', 'uol_ads'
  pixel_id TEXT NOT NULL,             -- ID do pixel
  is_active INTEGER NOT NULL DEFAULT 1, -- 0 ou 1
  event_types TEXT,                   -- JSON array dos eventos
  custom_code TEXT,                   -- Código personalizado
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `site_settings`
```sql
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,           -- 'google_analytics_id', 'meta_pixel_id', etc.
  value TEXT NOT NULL,                -- Valor da configuração
  type TEXT DEFAULT 'string',         -- Tipo do valor
  description TEXT,                   -- Descrição da configuração
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET `/api/pixels`
Retorna todas as configurações de pixels.

**Resposta:**
```json
{
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "metaPixelId": "XXXXXXXXXXXXXXXX",
  "uolAdsPixelId": "uol_pixel_id",
  "enableGoogleAnalytics": true,
  "enableMetaPixel": true,
  "enableUolAds": false,
  "customPixelCode": "<!-- código personalizado -->"
}
```

### POST `/api/pixels`
Salva as configurações de pixels.

**Payload:**
```json
{
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "metaPixelId": "XXXXXXXXXXXXXXXX",
  "uolAdsPixelId": "uol_pixel_id",
  "enableGoogleAnalytics": true,
  "enableMetaPixel": true,
  "enableUolAds": false,
  "customPixelCode": "<!-- código personalizado -->"
}
```

### GET `/api/pixels/config`
Retorna apenas os pixels ativos para uso no frontend.

### POST `/api/pixels/track`
Endpoint para rastrear eventos personalizados.

## Arquivos Modificados/Criados

### Backend
- `shared/schema-sqlite.ts` - Schema do banco atualizado
- `server/db-sqlite.ts` - Inicialização do banco atualizada
- `server/routes/pixels.ts` - **NOVO** - API para pixels
- `server/index.ts` - Rotas adicionadas

### Frontend
- `components/tracking-pixels.tsx` - **NOVO** - Componente principal
- `pages/admin/settings.tsx` - Aba de pixels adicionada
- `App.tsx` - Componente de pixels integrado
- `pages/home.tsx` - Exemplo de uso

### Documentação
- `PIXEL_SYSTEM_GUIDE.md` - **NOVO** - Este guia

## Validação e Testes

### 1. Testando os Pixels

1. Configure os pixels no admin
2. Acesse o site
3. Abra as Ferramentas do Desenvolvedor (F12)
4. Na aba Console, verifique as mensagens:
   - "Google Analytics pixel loaded: G-XXXXXXXXXX"
   - "Meta pixel loaded: XXXXXXXXXXXXXXXX"
   - "UOL Ads pixel loaded: uol_pixel_id"

### 2. Validando no Google Analytics

1. Acesse Google Analytics
2. Vá em Tempo real > Visão geral
3. Navegue no site e verifique se os eventos aparecem

### 3. Validando no Meta Pixel

1. Instale a extensão "Meta Pixel Helper"
2. Navegue no site
3. Verifique se o pixel está disparando corretamente

## Configurações de Segurança

O sistema inclui:

- Validação de entrada nos endpoints da API
- Escape de código HTML para prevenir XSS
- Rate limiting nos endpoints da API
- Logs de eventos para auditoria

## Monitoramento

Os pixels são carregados de forma assíncrona e não bloqueiam o carregamento da página. Em caso de erro:

- Os erros são logados no console
- Existe fallback para localStorage
- O site continua funcionando normalmente

## Suporte

Para adicionar novos pixels ou modificar eventos:

1. Atualize o componente `tracking-pixels.tsx`
2. Adicione os campos necessários na interface admin
3. Atualize a API se necessário
4. Teste as integrações

---

**Desenvolvido para IPPAX E-commerce**  
*Sistema de pixels completo com painel administrativo integrado*