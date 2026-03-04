import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Send, Shield, Truck, Award, Clock, Instagram } from "@/components/ui/optimized-icons"

const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "transition", "whileHover", "whileTap",
  "whileFocus", "whileDrag", "whileInView", "variants", "layout",
  "layoutId", "drag", "dragConstraints", "onAnimationStart", "onAnimationComplete",
])

function stripMotionProps(p: any) {
  const clean: any = {}
  for (const key in p) {
    if (!MOTION_PROPS.has(key)) clean[key] = p[key]
  }
  return clean
}

const fallbackMotion = {
  div: (p: any) => <div {...stripMotionProps(p)} />,
  a: (p: any) => <a {...stripMotionProps(p)} />,
}

let framerModuleCache: any = null
let framerModulePromise: Promise<any | null> | null = null

function loadFramerModule() {
  if (framerModuleCache) return Promise.resolve(framerModuleCache)

  if (!framerModulePromise) {
    framerModulePromise = import("framer-motion")
      .then((mod) => {
        framerModuleCache = mod
        return mod
      })
      .catch(() => null)
  }

  return framerModulePromise
}

function useFramer() {
  const [fm, setFm] = useState<any>(() => framerModuleCache)

  useEffect(() => {
    if (fm) return

    let isMounted = true
    loadFramerModule().then((mod) => {
      if (isMounted && mod) setFm(mod)
    })

    return () => {
      isMounted = false
    }
  }, [fm])

  return fm
}

export default function Footer() {
  const fm = useFramer()
  const motion = fm?.motion ?? fallbackMotion
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    // TODO: Integrar com backend real (Upseller API ou email marketing)
    console.log("Newsletter opt-in:", email)
    await new Promise(resolve => setTimeout(resolve, 800))
    setSubscribed(true)
    setEmail("")
    setIsSubscribing(false)
  }

  const features = [
    { icon: Shield, text: "600 Panos por Rolo" },
    { icon: Truck, text: "Frete Grátis (consulte)" },
    { icon: Award, text: "Tecnologia HydroSpun" },
    { icon: Clock, text: "Reutilizável até 10x" }
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl" />
      </div>

      {/* Features bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-slate-300"
              >
                <feature.icon className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 font-black text-2xl inline-block rounded-lg shadow-lg">
                IPPAX
              </div>
              <p className="text-xs text-teal-400 mt-2">+MAIS — PANOS MULTIUSO PREMIUM</p>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Alta performance em limpeza profissional e doméstica. Panos multiuso com tecnologia HydroSpun de alta absorção e resistência.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>CONNECT TRADES IMPORTAÇÃO E EXPORTAÇÃO LTDA</p>
              <p>CNPJ: 50.891.566/0001-29</p>
            </div>
            <div className="flex gap-3">
              <motion.a
                href="https://instagram.com/ippaxmais"
                target="_blank"
                rel="noopener"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </motion.a>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-6">
              <span className="text-teal-400">Com</span><span className="text-teal-600">pre</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#catalogo" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Nossos Produtos
                </a>
              </li>
              <li>
                <a href="#b2b" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Atacado / B2B
                </a>
              </li>
              <li>
                <a href="https://wa.me/5547988028270" target="_blank" rel="noopener" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Fale Conosco
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold mb-6">
                <span className="text-teal-400">Con</span><span className="text-teal-600">tato</span>
              </h3>
              <div className="space-y-3 text-slate-400">
                <a href="tel:+5547988028270" className="flex items-center gap-3 hover:text-teal-400 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>(47) 98802-8270</span>
                </a>
                <a href="mailto:davi@ippax.com" className="flex items-center gap-3 hover:text-teal-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>davi@ippax.com</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span className="text-sm">
                    R. Doutor Pedro Ferreira, 155<br />
                    Sala 01402 A Box 88, Centro<br />
                    Itajaí - SC
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-white">Ofertas Exclusivas</h4>
              <p className="text-slate-400 text-sm mb-4">
                Receba cupons e ofertas com até 20% OFF
              </p>
              {subscribed ? (
                <p className="text-teal-400 text-sm font-semibold">Cadastrado! Fique de olho no seu email.</p>
              ) : (
                <form onSubmit={handleNewsletter} className="space-y-3">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 pr-12 focus:border-teal-500 transition-colors"
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubscribing}
                      className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-3"
                    >
                      {isSubscribing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-slate-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 IPPAX +MAIS — CONNECT TRADES IMPORTAÇÃO E EXPORTAÇÃO LTDA. Todos os direitos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
