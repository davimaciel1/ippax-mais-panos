import { ShoppingBag, Store, Package, Home } from "@/components/ui/optimized-icons";
import { getAssetUrl } from "@/lib/config";

// Marketplace configurations - Links atualizados em 05/03/2026
export const marketplaceConfigs = {
  amazon: {
    name: 'amazon',
    displayName: 'Amazon',
    affiliateLink: 'https://amzn.to/47tcwk3', // Pano afiliado
    colors: {
      primary: '#FF9900',
      secondary: '#FF6600',
      text: '#FFFFFF'
    },
    logo: "/assets/amazon.jpg",
    icon: ShoppingBag,
    enabled: true
  },

  mercadolivre: {
    name: 'mercadolivre',
    displayName: 'Mercado Livre',
    affiliateLink: 'https://www.mercadolivre.com.br/pano-multiuso-tipo-perfex--azul--600--unidade-240m-20-cm/up/MLBU3810544994',
    colors: {
      primary: '#FFE600',
      secondary: '#FFD700',
      text: '#333333'
    },
    logo: "/assets/mercadolivre.jpg",
    icon: Store,
    enabled: true
  },

  shopee: {
    name: 'shopee',
    displayName: 'Shopee',
    affiliateLink: 'https://s.shopee.com.br/10xwx3ADDr', // Pano afiliado
    colors: {
      primary: '#EE4D2D',
      secondary: '#FF6B35',
      text: '#FFFFFF'
    },
    logo: "/assets/shopee.jpg",
    icon: Package,
    enabled: true
  },

  tiktok: {
    name: 'tiktok',
    displayName: 'TikTok Shop',
    affiliateLink: 'https://www.tiktok.com',
    colors: {
      primary: '#000000',
      secondary: '#69C9D0',
      text: '#FFFFFF'
    },
    logo: "/assets/tiktok.png",
    icon: ShoppingBag,
    enabled: false
  }
};

// Function to get marketplace config with admin overrides
export const getMarketplaceConfig = (marketplaceName: keyof typeof marketplaceConfigs) => {
  const baseConfig = marketplaceConfigs[marketplaceName];

  // Try to load admin settings from localStorage
  try {
    const savedSettings = localStorage.getItem('marketplace-affiliate-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      const marketplaceSettings = parsed.find((m: any) => m.marketplace === marketplaceName);

      if (marketplaceSettings) {
        return {
          ...baseConfig,
          enabled: marketplaceSettings.enabled ?? baseConfig.enabled,
          affiliateLink: marketplaceSettings.link || baseConfig.affiliateLink,
          displayName: baseConfig.displayName,
          logo: marketplaceSettings.image || baseConfig.logo
        };
      }
    }
  } catch (error) {
    console.error('Error loading marketplace settings:', error);
  }

  return baseConfig;
};

// Function to save marketplace settings (for admin use)
export const saveMarketplaceSettings = (settings: Record<string, any>) => {
  try {
    localStorage.setItem('marketplace-affiliate-settings', JSON.stringify(settings));
    console.log('Marketplace settings saved:', settings);
  } catch (error) {
    console.error('Error saving marketplace settings:', error);
  }
};
