import { useEffect, useState } from "react";
import ProductHero from "@/components/product-hero";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import B2BContactForm from "@/components/b2b-contact-form";
import WhatsAppButton from "@/components/whatsapp-button";
import { Package, RefreshCw, Shield, Droplets, Check, ChevronRight, Sparkles, Droplet, Car, UtensilsCrossed, Loader2 } from "lucide-react";
import { trackEvent } from "@/components/tracking-pixels";

// Links de afiliados - Atualizados em 03/03/2026
const MARKETPLACE_LINKS = {
  mercadolivre_20x40: "https://www.mercadolivre.com.br/pano-multiuso-tipo-perfex--azul--600--unidade-240m-20-cm/up/MLBU3810544994",
  mercadolivre_28x40: "https://www.mercadolivre.com.br/pano-multiuso-para-limpeza-ippax-mais-28x40cm-600un-azul-240m/up/MLBU3819226008",
  amazon_20x40: "https://amzn.to/4juDCMM",
  amazon_28x40: "https://amzn.to/4jm23vv",
  shopee_20x40: "https://s.shopee.com.br/4AtPq0GxIG",
  shopee_28x40: "https://s.shopee.com.br/3Vdj2p0gPR",
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
      <section className="py-16 bg-white border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Package, label: "600 Unidades", sub: "Rende muito mais" },
            { icon: RefreshCw, label: "Reutilizável", sub: "Lave e use 10x" },
            { icon: Shield, label: "Super Resistente", sub: "Tecnologia HydroSpun" },
            { icon: Droplets, label: "Ultra Absorvente", sub: "Seca na hora" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 text-teal-dark">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">{item.label}</h3>
              <p className="text-slate-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UGC Video Testimonial Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              📱 Veja na Prática
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Clientes Reais, <span className="text-teal-dark">Resultados Reais</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Veja como nossos clientes estão usando o Pano Multiuso IPPAX +MAIS no dia a dia
            </p>
          </div>

          <div className="flex justify-center">
            {/* Phone Frame Container */}
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-10" />

                {/* Video Container */}
                <div className="relative w-[320px] h-[580px] md:w-[360px] md:h-[640px] rounded-[2.5rem] overflow-hidden bg-black">
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
      <section id="catalogo" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 mb-6">Nossos Produtos</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Escolha o tamanho ideal para sua necessidade. Qualidade profissional em ambos os formatos.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Product 1 */}
            <div className="group bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FFE600] text-slate-900 font-bold px-6 py-3 rounded-bl-3xl z-10">
                MAIS VENDIDO
              </div>

              <div className="w-full h-80 bg-slate-50 rounded-[2rem] mb-10 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                <img src="/assets/pano-20x40.webp" alt="Pano 20x40" className="w-full h-full object-contain drop-shadow-lg" />
              </div>

              <h3 className="text-3xl font-bold text-slate-900 mb-2">Pano Multiuso 20x40cm</h3>
              <p className="text-slate-500 mb-8 text-lg">Perfeito para uso diário, bancadas e cozinhas.</p>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
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
            <div className="group bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-accent text-white font-bold px-6 py-3 rounded-bl-3xl z-10">
                PREMIUM
              </div>

              <div className="w-full h-80 bg-orange-50/30 rounded-[2rem] mb-10 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                <img src="/assets/pano-28x40.png" alt="Pano 28x40" className="w-full h-full object-contain drop-shadow-lg" />
              </div>

              <h3 className="text-3xl font-bold text-slate-900 mb-2">Pano Multiuso 28x40cm</h3>
              <p className="text-slate-500 mb-8 text-lg">Área maior para limpezas pesadas e profissionais.</p>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
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
      <section id="dicas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Dicas Profissionais
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Dicas de <span className="text-teal-dark">Uso</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Aproveite ao máximo cada pano com essas dicas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-400 border border-slate-100 group"
              >
                <div className={`w-14 h-14 ${tip.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <tip.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
                <p className="text-slate-500 leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Opt-in Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-xl p-10 border border-slate-100 text-center"
          >
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Ofertas Exclusivas
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-3">
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
