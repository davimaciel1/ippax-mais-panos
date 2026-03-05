interface TrackingPixelsProps {
  pixelSettings?: unknown
}

export default function TrackingPixels(_: TrackingPixelsProps) {
  return null
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const utm: Record<string, string> = {}
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
  keys.forEach((key) => {
    const val = sessionStorage.getItem(key)
    if (val) utm[key] = val
  })
  return utm
}

export const trackEvent = {
  ga: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", eventName, { ...getUtmParams(), ...parameters })
    }
  },

  meta: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", eventName, { ...getUtmParams(), ...parameters })
    }
  },

  uol: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).uolads) {
      ;(window as any).uolads("track", eventName, { ...getUtmParams(), ...parameters })
    }
  },

  all: (eventName: string, parameters?: Record<string, any>) => {
    trackEvent.ga(eventName, parameters)
    trackEvent.meta(eventName, parameters)
    trackEvent.uol(eventName, parameters)
  },
}

export const ecommerceEvents = {
  viewProduct: (productId: string, productName: string, category: string, price: number) => {
    trackEvent.ga("view_item", {
      currency: "BRL",
      value: price,
      items: [{ item_id: productId, item_name: productName, item_category: category, price, quantity: 1 }],
    })

    trackEvent.meta("ViewContent", {
      content_type: "product",
      content_ids: [productId],
      content_name: productName,
      content_category: category,
      value: price,
      currency: "BRL",
    })
  },
}
