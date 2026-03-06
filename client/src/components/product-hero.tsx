import React, { useEffect, useState } from "react";
import { ShoppingCart, Star, Shield, Truck, Check } from "@/components/ui/optimized-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getMarketplaceConfig } from './marketplace-configs';
import { trackEvent } from '@/components/tracking-pixels';

// Framer Motion props that should NOT be forwarded to plain DOM elements
const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "transition", "whileHover", "whileTap",
  "whileFocus", "whileDrag", "whileInView", "variants", "layout",
  "layoutId", "drag", "dragConstraints", "onAnimationStart", "onAnimationComplete",
])
function stripMotionProps(p: any) {
  const clean: any = {}
  for (const key in p) { if (!MOTION_PROPS.has(key)) clean[key] = p[key] }
  return clean
}

// Lazy load framer-motion to reduce initial JS
function useFramer() {
  const [fm, setFm] = useState<any>(null);
  useEffect(() => {
    import('framer-motion').then(setFm).catch(() => { });
  }, []);
  return fm;
}

export default function ProductHero() {
  const fm = useFramer();
  const motion = fm?.motion ?? {
    div: (p: any) => <div {...stripMotionProps(p)} />,
  };

  // Get marketplace configs directly
  const amazonConfig = getMarketplaceConfig('amazon');
  const mercadolivreConfig = getMarketplaceConfig('mercadolivre');
  const shopeeConfig = getMarketplaceConfig('shopee');
  const tiktokConfig = getMarketplaceConfig('tiktok');

  const marketplaces = [
    { config: amazonConfig, name: 'amazon' },
    { config: shopeeConfig, name: 'shopee' },
    { config: mercadolivreConfig, name: 'mercadolivre' },
    { config: tiktokConfig, name: 'tiktok' },
  ].filter(m => m.config.enabled);

  const handleMarketplaceClick = (marketplace: string, link: string) => {
    if (!link) return;
    trackEvent.all('affiliate_click', {
      marketplace: marketplace,
      product_category: 'pano-multiuso',
      source: 'product-hero'
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-teal-50/30 py-4 md:py-20 md:min-h-[calc(100vh-120px)] flex items-center overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">

            {/* Left side - Product Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-3 md:space-y-8"
            >
              {/* Badge - hidden on mobile for compactness */}
              <div className="hidden md:inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Star className="w-4 h-4" />
                <span>Mais Vendido nos Marketplaces</span>
              </div>

              {/* Title */}
              <div className="space-y-2 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
                  <span className="text-slate-800">Pano Multiuso</span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">IPPAX +MAIS</span>
                </h1>
                <p className="text-base md:text-xl lg:text-2xl text-slate-600 max-w-lg">
                  Alta absorção, reutilizável e super resistente. <span className="font-semibold text-orange-500">600 unidades</span> por rolo.
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 md:gap-4">
                {[
                  { icon: Check, text: "Não solta pelos" },
                  { icon: Shield, text: "Antibactérias" },
                  { icon: Truck, text: "Frete Grátis" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-slate-100">
                    <feature.icon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="space-y-3 md:space-y-6 pt-2 md:pt-4">
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-500 mb-2 md:mb-3 uppercase tracking-wide">
                    Compre nos principais marketplaces:
                  </p>
                  <p className="hidden md:block text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 mb-4 md:mb-6">
                    Economia Garantida
                  </p>
                </div>

                {/* Marketplace Buttons - Single Row */}
                <div className="flex items-center gap-4 flex-wrap">
                  {marketplaces.map(({ config, name }) => (
                    <a
                      key={name}
                      href={config.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMarketplaceClick(name, config.affiliateLink)}
                      className="group bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-teal-400 rounded-xl p-2.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      title={`Comprar na ${config.displayName}`}
                    >
                      <img
                        src={config.logo}
                        alt={config.displayName}
                        className="h-[41px] w-auto object-contain"
                      />
                    </a>
                  ))}
                </div>

                <p className="text-xs md:text-sm text-slate-500 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-600" />
                  Frete Grátis + Parcelamento em até 12x
                </p>
              </div>
            </motion.div>

            {/* Right side - Product Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-white">
                  <img
                    src="/assets/pano-hero-fun.jpg"
                    alt="IPPAX Pano Multiuso - Familia usando o produto"
                    className="w-full h-auto"
                  />

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold">Alta Absorção</span>
                  </div>
                </div>

                {/* Floating specs card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute -bottom-4 left-2 md:-bottom-6 md:-left-6 lg:-bottom-8 lg:-left-8 bg-white rounded-2xl shadow-xl p-4 md:p-5 max-w-[220px] md:max-w-[260px] border border-slate-100"
                >
                  <h4 className="font-bold mb-3 text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    Especificações
                  </h4>
                  <ul className="text-sm space-y-2">
                    {[
                      { label: "Comprimento", value: "240 metros" },
                      { label: "Picote", value: "A cada 40cm" },
                      { label: "Gramatura", value: "35g/m²" },
                      { label: "Quantidade", value: "600 Panos" },
                    ].map((spec, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="text-slate-500">{spec.label}:</span>
                        <span className="font-semibold text-teal-700">{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Rating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3 hidden md:block"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">4.9</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">+1.200 avaliações</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}