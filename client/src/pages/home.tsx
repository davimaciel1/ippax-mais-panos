import { useEffect, useState } from "react";
import ProductHero from "@/components/product-hero";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import B2BContactForm from "@/components/b2b-contact-form";
import WhatsAppButton from "@/components/whatsapp-button";
import { Package, RefreshCw, Shield, Droplets, Check, ChevronRight, Sparkles, Droplet, Car, UtensilsCrossed, Loader2 } from "lucide-react";
import { trackEvent } from "@/components/tracking-pixels";

// Links de afiliados - Atualizados em 05/03/2026
const MARKETPLACE_LINKS = {
  mercadolivre_20x40: "https://www.mercadolivre.com.br/pano-multiuso-tipo-perfex--azul--600--unidade-240m-20-cm/up/MLBU3810544994",
  mercadolivre_28x40: "https://www.mercadolivre.com.br/pano-multiuso-para-limpeza-ippax-mais-28x40cm-600un-azul-240m/up/MLBU3819226008",
  amazon_20x40: "https://amzn.to/47tcwk3",
  amazon_28x40: "https://amzn.to/47tcwk3",
  shopee_20x40: "https://s.shopee.com.br/10xwx3ADDr",
  shopee_28x40: "https://s.shopee.com.br/10xwx3ADDr",
};

const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "transition", "whileHover", "whileTap",
  "whileFocus", "whileDrag", "whileInView", "variants", "layout",
  "layoutId", "drag", "dragConstraints", "onAnimationStart", "onAnimationComplete",
]);

function stripMotionProps(p: any) {
  const clean: any = {};
  for (const key in p) {
    if (!MOTION_PROPS.has(key)) clean[key] = p[key];
  }
  return clean;
}

const fallbackMotion = {
  div: (p: any) => <div {...stripMotionProps(p)} />,
};

let framerModuleCache: any = null;
let framerModulePromise: Promise<any | null> | null = null;

function loadFramerModule() {
  if (framerModuleCache) return Promise.resolve(framerModuleCache);

  if (!framerModulePromise) {
    framerModulePromise = import("framer-motion")
      .then((mod) => {
        framerModuleCache = mod;
        return mod;
      })
      .catch(() => null);
  }

  return framerModulePromise;
}

function useFramer() {
  const [fm, setFm] = useState<any>(() => framerModuleCache);

  useEffect(() => {
    if (fm) return;

    let isMounted = true;
    loadFramerModule().then((mod) => {
      if (isMounted && mod) setFm(mod);
    });

    return () => {
      isMounted = false;
    };
  }, [fm]);

  return fm;
}

export default function Home() {
  const fm = useFramer();
  const motion = fm?.motion ?? fallbackMotion;
  const [optinEmail, setOptinEmail] = useState("");
  const [optinPhone, setOptinPhone] = useState("");
  const [optinDone, setOptinDone] = useState(false);

  // Capture UTM params and save to sessionStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Save UTM params
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) sessionStorage.setItem(key, value);
    });

    // Handle ?produto= scroll
    const produto = params.get("produto");
    if (produto) {
      setTimeout(() => {
        const el = document.getElementById("catalogo");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 800);
    }
  }, []);

  const [optinLoading, setOptinLoading] = useState(false);
  const [optinError, setOptinError] = useState("");

  const handleOptin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOptinLoading(true);
    setOptinError("");

    const utmSource = sessionStorage.getItem("utm_source") || "";
    const utmMedium = sessionStorage.getItem("utm_medium") || "";
    const utmCampaign = sessionStorage.getItem("utm_campaign") || "";

    try {
      const res = await fetch("https://upseller.ippaxmais.com.br/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: optinEmail,
          telefone: optinPhone || null,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar");
      setOptinDone(true);
      trackEvent.all("lead_signup", {
        utm_source: utmSource,
        utm_campaign: utmCampaign,
      });
    } catch {
      setOptinError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setOptinLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navigation />

      {/* Hero Section using Premium Component */}
      <div>
        <ProductHero />
      </div>

      {/* Trust Bar */}
      <section className="py-10 md:py-16 bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {[
            { icon: Package, label: "600 Unidades", sub: "Rende muito mais" },
            { icon: RefreshCw, label: "Reutilizável", sub: "Lave e use 10x" },
            { icon: Shield, label: "Super Resistente", sub: "Tecnologia HydroSpun" },
            { icon: Droplets, label: "Ultra Absorvente", sub: "Seca na hora" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-3 md:p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-teal-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 text-teal-dark">
                <item.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="font-bold text-base md:text-xl text-slate-800">{item.label}</h3>
              <p className="text-slate-500 text-xs md:text-base">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UGC Video Testimonial Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
              Veja na Prática
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3">
              Clientes Reais, <span className="text-teal-dark">Resultados Reais</span>
            </h2>
            <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto">
              Veja como nossos clientes estão usando o Pano Multiuso IPPAX +MAIS no dia a dia
            </p>
          </div>

          <div className="flex justify-center">
            {/* Phone Frame Container */}
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-6 md:h-7 bg-slate-900 rounded-b-2xl z-10" />

                {/* Video Container */}
                <div className="relative w-[260px] h-[460px] md:w-[360px] md:h-[640px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-black">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/assets/pano-hero-fun.jpg"
                  >
                    <source src="/assets/ugc-video.mp4" type="video/mp4" />
                    Seu navegador não suporta vídeos.
                  </video>

                  {/* Video Overlay - Social Proof */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">@mariana_casa</p>
                        <p className="text-white/70 text-xs">Cliente verificada ✓</p>
                      </div>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      "Melhor investimento pra limpeza da casa! Rende muito e absorve tudo 💙"
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-4 top-20 bg-white rounded-2xl shadow-xl p-4 hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-bold text-slate-800">4.9/5</p>
                    <p className="text-xs text-slate-500">+1.2k avaliações</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-32 bg-white rounded-2xl shadow-xl p-4 hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="font-bold text-slate-800">Mais Vendido</p>
                    <p className="text-xs text-slate-500">na categoria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="catalogo" className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6">Nossos Produtos</h2>
            <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto">Escolha o tamanho ideal para sua necessidade. Qualidade profissional em ambos os formatos.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-12 max-w-6xl mx-auto">
            {/* Product 1 */}
            <div className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FFE600] text-slate-900 font-bold px-6 py-3 rounded-bl-3xl z-10">
                MAIS VENDIDO
              </div>

              <div className="w-full h-48 md:h-80 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] mb-6 md:mb-10 flex items-center justify-center p-4 md:p-8 group-hover:scale-105 transition-transform duration-500">
                <img src="/assets/pano-20x40.webp" alt="Pano 20x40" className="w-full h-full object-contain drop-shadow-lg" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Pano Multiuso 20x40cm</h3>
              <p className="text-slate-500 mb-5 md:mb-8 text-sm md:text-lg">Perfeito para uso diário, bancadas e cozinhas.</p>

              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full mb-5 md:mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-teal-dark">600</span>
                  <span className="text-sm text-slate-500">Unidades</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-teal-dark">240m</span>
                  <span className="text-sm text-slate-500">Comprimento</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <p className="text-sm font-medium text-slate-500 text-center">Escolha onde comprar:</p>
                <div className="flex items-center justify-center gap-4">
                  <a href={MARKETPLACE_LINKS.amazon_20x40} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 hover:-translate-y-1 transition-all duration-300" title="Comprar na Amazon">
                    <img src="/assets/amazon.jpg" className="h-10 w-auto object-contain rounded-lg" alt="Amazon" />
                  </a>
                  <a href={MARKETPLACE_LINKS.shopee_20x40} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 hover:-translate-y-1 transition-all duration-300" title="Comprar na Shopee">
                    <img src="/assets/shopee.jpg" className="h-10 w-auto object-contain rounded-lg" alt="Shopee" />
                  </a>
                  <a href={MARKETPLACE_LINKS.mercadolivre_20x40} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 hover:-translate-y-1 transition-all duration-300" title="Comprar no Mercado Livre">
                    <img src="/assets/mercadolivre.jpg" className="h-10 w-auto object-contain rounded-lg" alt="Mercado Livre" />
                  </a>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-accent text-white font-bold px-6 py-3 rounded-bl-3xl z-10">
                PREMIUM
              </div>

              <div className="w-full h-48 md:h-80 bg-orange-50/30 rounded-[1.5rem] md:rounded-[2rem] mb-6 md:mb-10 flex items-center justify-center p-4 md:p-8 group-hover:scale-105 transition-transform duration-500">
                <img src="/assets/pano-28x40.png" alt="Pano 28x40" className="w-full h-full object-contain drop-shadow-lg" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Pano Multiuso 28x40cm</h3>
              <p className="text-slate-500 mb-5 md:mb-8 text-sm md:text-lg">Área maior para limpezas pesadas e profissionais.</p>

              <div className="grid grid-cols-2 gap-3 md:gap-4 w-full mb-5 md:mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-orange-accent">600</span>
                  <span className="text-sm text-slate-500">Unidades</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="block text-2xl font-bold text-orange-accent">240m</span>
                  <span className="text-sm text-slate-500">Comprimento</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <p className="text-sm font-medium text-slate-500 text-center">Escolha onde comprar:</p>
                <div className="flex items-center justify-center gap-4">
                  <a href={MARKETPLACE_LINKS.amazon_28x40} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 hover:-translate-y-1 transition-all duration-300" title="Comprar na Amazon">
                    <img src="/assets/amazon.jpg" className="h-10 w-auto object-contain rounded-lg" alt="Amazon" />
                  </a>
                  <a href={MARKETPLACE_LINKS.shopee_28x40} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 hover:-translate-y-1 transition-all duration-300" title="Comprar na Shopee">
                    <img src="/assets/shopee.jpg" className="h-10 w-auto object-contain rounded-lg" alt="Shopee" />
                  </a>
                  <a href={MARKETPLACE_LINKS.mercadolivre_28x40} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 hover:-translate-y-1 transition-all duration-300" title="Comprar no Mercado Livre">
                    <img src="/assets/mercadolivre.jpg" className="h-10 w-auto object-contain rounded-lg" alt="Mercado Livre" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dicas de Uso */}
      <section id="dicas" className="py-14 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
              Dicas Profissionais
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3">
              Dicas de <span className="text-teal-dark">Uso</span>
            </h2>
            <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto">
              Aproveite ao máximo cada pano com essas dicas
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {[
              { icon: UtensilsCrossed, title: "Cozinha", desc: "Use úmido com detergente neutro. Remove gordura sem esforço e não deixa marcas no inox.", color: "bg-orange-100 text-orange-600" },
              { icon: Sparkles, title: "Vidros & Espelhos", desc: "Use seco para polir. As fibras finas não deixam fiapos nem marcas.", color: "bg-blue-100 text-blue-600" },
              { icon: Droplet, title: "Banheiro", desc: "Antibacteriano natural. Ideal para pias, boxes e bancadas. Reutilize até 10 vezes.", color: "bg-teal-100 text-teal-600" },
              { icon: Car, title: "Automóvel", desc: "Limpa painel, vidros e estofados sem riscar. Super absorvente para secar após lavagem.", color: "bg-slate-100 text-slate-600" },
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl md:rounded-[2rem] p-4 md:p-8 shadow-lg hover:shadow-xl transition-all duration-400 border border-slate-100 group"
              >
                <div className={`w-10 h-10 md:w-14 md:h-14 ${tip.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 group-hover:scale-110 transition-transform`}>
                  <tip.icon className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-1 md:mb-3">{tip.title}</h3>
                <p className="text-slate-500 text-xs md:text-base leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Opt-in Section */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl md:rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100 text-center"
          >
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Ofertas Exclusivas
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
              Quer até <span className="text-orange-accent">20% OFF</span>?
            </h2>
            <p className="text-slate-500 mb-8">
              Cadastre-se e receba cupons exclusivos e novidades direto no seu celular.
            </p>
            {optinDone ? (
              <div className="bg-teal-50 rounded-2xl p-6">
                <Check className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                <p className="text-teal-700 font-bold text-lg">Cadastrado com sucesso!</p>
                <p className="text-teal-600 text-sm mt-1">Fique de olho no seu email e celular.</p>
                <a
                  href="https://whatsapp.com/channel/0029VbCUZj36BIEmxuhY7H2l"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent.all("whatsapp_channel_follow", { source: "optin_success" })}
                  className="mt-4 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Seguir Canal de Ofertas
                </a>
              </div>
            ) : (
              <form onSubmit={handleOptin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={optinEmail}
                  onChange={(e) => setOptinEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp (opcional)"
                  value={optinPhone}
                  onChange={(e) => setOptinPhone(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                {optinError && (
                  <p className="text-red-500 text-sm">{optinError}</p>
                )}
                <button
                  type="submit"
                  disabled={optinLoading}
                  className="w-full bg-orange-accent hover:bg-orange-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-accent/30 transition-all hover:-translate-y-1 disabled:opacity-60"
                >
                  {optinLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Cadastrando...
                    </span>
                  ) : (
                    "Quero Receber Ofertas!"
                  )}
                </button>
                <p className="text-xs text-slate-400 mt-2">
                  Ao se cadastrar, você concorda com o uso dos dados para comunicações da Ippax +Mais, conforme a LGPD. Pode cancelar a qualquer momento.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">ou</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <a
                  href="https://whatsapp.com/channel/0029VbCUZj36BIEmxuhY7H2l"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent.all("whatsapp_channel_follow", { source: "optin_form" })}
                  className="mt-3 inline-flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Seguir Canal de Ofertas no WhatsApp
                </a>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <B2BContactForm />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
