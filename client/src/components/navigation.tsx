import React, { useState, useEffect, memo } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "@/components/ui/optimized-icons"

// Framer Motion props that should NOT be forwarded to plain DOM elements
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
  button: (p: any) => <button {...stripMotionProps(p)} />,
  span: (p: any) => <span {...stripMotionProps(p)} />,
}

const FallbackAnimatePresence = ({ children }: any) => <>{children}</>

const SITE_LOGO = "/assets/ippax-logo-v2.jpg"
const SITE_NAME = "IPPAX +MAIS"

const LogoImage = memo(function LogoImage({ className }: { className: string }) {
  return (
    <img
      src={SITE_LOGO}
      alt={`${SITE_NAME} Pano Multiuso Premium`}
      className={className}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = "/assets/ippax-logo.jpg"
      }}
    />
  )
})

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

// Lazy/dynamic import for framer-motion to reduce initial bundle size
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

export default function Navigation() {
  const fm = useFramer()
  const motion = fm?.motion ?? fallbackMotion
  const AnimatePresence = fm?.AnimatePresence ?? FallbackAnimatePresence
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [, setLocation] = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Produtos", href: "#catalogo" },
    { label: "Dicas de Uso", href: "#dicas" },
    { label: "Atacado / B2B", href: "#b2b" },
  ]

  return (
    <>
      {/* Top Promotional Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-teal-600 to-teal-700 text-white relative overflow-hidden"
      >
        <div className="relative py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <p className="text-sm md:text-base font-semibold text-center">
              OFERTA ESPECIAL: <span className="text-yellow-300">Frete Grátis</span> na compra de 2 ou mais rolos
            </p>
          </div>
        </div>
      </motion.div>

      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/95 backdrop-blur-xl shadow-xl py-2"
        : "bg-white shadow-sm py-4"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              onClick={() => setLocation("/")}
            >
              <LogoImage className="h-12 md:h-14 object-contain" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative px-4 py-2 text-slate-700 hover:text-teal-600 font-medium text-base transition-all duration-300 group"
                >
                  <span className="relative z-10">
                    {item.label}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-teal-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Cart */}
              <a
                href="#catalogo"
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Comprar Agora
              </a>

            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-3">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-teal-50">
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90 }}
                          animate={{ rotate: 0 }}
                          exit={{ rotate: 90 }}
                        >
                          <X className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90 }}
                          animate={{ rotate: 0 }}
                          exit={{ rotate: -90 }}
                        >
                          <Menu className="h-6 w-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-gradient-to-b from-white to-slate-50">
                  <SheetTitle className="sr-only">Menu de navegacao</SheetTitle>
                  <SheetDescription className="sr-only">
                    Acesse as secoes de produtos, dicas de uso e atacado.
                  </SheetDescription>
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-center mb-8">
                      <LogoImage className="h-16 object-contain" />
                    </div>

                    {/* Mobile Nav Items */}
                    <div className="flex-1 space-y-2">
                      {navItems.map((item, index) => (
                        <motion.a
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="block py-4 px-4 text-slate-700 hover:text-teal-600 hover:bg-teal-50 font-medium text-lg rounded-xl transition-all"
                        >
                          {item.label}
                        </motion.a>
                      ))}
                    </div>

                    {/* Mobile CTA */}
                    <div className="space-y-4 pt-6 border-t">
                      <a
                        href="#catalogo"
                        onClick={() => setIsOpen(false)}
                        className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold py-4 text-base rounded-full text-center hover:from-teal-700 hover:to-teal-800 transition-all"
                      >
                        Comprar Agora
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

    </>
  )
}
