// Prompt Engine for Conceptual Subagents & Skeleton Definition (Based on taste-SKILL.md)

export function generateIrresistibleOffer({ clientName = '', industry = '', targetLocation = 'Maryland, USA', currentPain = '' }) {
  return {
    title: `Propuesta Irresistible B2B para ${clientName || 'Cliente Maryland'}`,
    tagline: `Presencia Visual Outdoor de Alto Impacto con Garantía de 5 Años`,
    coreOffer: `Transformación completa de fachada exterior o flota comercial en 3 a 5 días hábiles, incluyendo renderizado 3D previo sin costo y garantía por escrito contra decoloración solar.`,
    benefits: [
      'Captación inmediata del flujo peatonal y vehicular 24/7.',
      'Instalación profesional en horarios flexibles sin interrumpir las ventas del negocio.',
      'Financiación en 3 cuotas fijas para proyectos comerciales de $1,500+ USD.'
    ],
    guarantee: 'Garantía escrita de 5 años contra desteñido por rayos UV y desprendimiento por clima en Maryland.',
    callToAction: 'Solicitar Simulación Visual 3D Gratis en 2 Horas'
  };
}

export function generateBuyerPersona({ industry = 'Gastronomía & Comercios', location = 'Maryland' }) {
  return {
    personaTitle: `Dueño o Gerente de Comercio Físico en ${location}`,
    demographics: `Hombres y mujeres de 30 a 58 años, propietarios de restaurantes, locales retail o empresas de servicios.`,
    painPoints: [
      'Poca visibilidad nocturna desde la calle que hace perder clientes ante locales vecinos mejor iluminados.',
      'Imagen informal o fachada anticuada que desmerece la calidad real del producto o servicio.',
      'Temor a invertir miles de dólares en carteles que se destiñan o arruinen con la lluvia en pocos meses.'
    ],
    desires: [
      'Un local que transmita autoridad, higiene y estatus premium desde el primer segundo.',
      'Generar consultas continuas sin tener que depender únicamente de publicidad digital.',
      'Proceso sin estrés con un proveedor local confiable que se encargue de todo (diseño, permisos, instalación).'
    ],
    objections: [
      '¿Irá a interrumpir la atención a mis clientes durante la instalación?',
      '¿Cómo sé exactamente cómo se verá antes de pagar?'
    ]
  };
}

export function generateSkeletonStructure({ offer, persona }) {
  return {
    sections: [
      {
        id: 'hero',
        name: 'Sección Hero Principal',
        purpose: 'Captar atención inmediata con badge de durabilidad y titular centrado en resultados B2B.',
        copyHeadline: offer.tagline,
        copySubheadline: 'Ayudamos a comercios y empresas en Maryland a atraer hasta 40% más clientes reales desde la calle con cartelería y vinilos 3M.',
        ctaText: offer.callToAction
      },
      {
        id: 'problem',
        name: 'Problema & Agitación (Puntos de Dolor)',
        purpose: 'Conectar emocionalmente con la frustración del comprador.',
        points: persona.painPoints
      },
      {
        id: 'value_props',
        name: 'Propuesta de Valor & Solución (Bento Grid)',
        purpose: 'Presentar los pilares de la oferta técnica y comercial.',
        items: offer.benefits
      },
      {
        id: 'social_proof',
        name: 'Prueba Social (Casos Locales en Maryland)',
        purpose: 'Eliminar el riesgo percibido mostrando testimonios de comercios similares.',
        quotes: [
          { quote: 'Nuestras ventas nocturnas aumentaron un 30% tras instalar las letras LED.', author: 'Cliente Local Maryland' }
        ]
      },
      {
        id: 'form',
        name: 'Formulario de Cotización GHL',
        purpose: 'Capturar el lead calificado con selector de proyecto.'
      },
      {
        id: 'footer',
        name: 'Pie de Página Corporativo',
        purpose: 'Cierre limpio de marca con datos de contacto local.'
      }
    ]
  };
}

export function inferDesignDials(vibe = 'Linear-minimal') {
  switch (vibe) {
    case 'Apple-clean':
      return { variance: 7, motion: 6, density: 3, description: 'Espaciado generoso, imágenes hero grandes, degradados suaves y bordes limpios.' };
    case 'Dark tech':
      return { variance: 8, motion: 8, density: 4, description: 'Fondo oscuro #090d16, neón azul/cian, contraste alto y bento grids.' };
    case 'Corporate B2B':
      return { variance: 4, motion: 3, density: 5, description: 'Sobrio, estructurado, alta legibilidad y jerarquía clara.' };
    default: // Linear-minimal / Coda
      return { variance: 6, motion: 4, density: 3, description: 'Monocromático Coda, bordes inset 1.5px, Inter + Calibre-R, transiciones snappy 50ms-200ms.' };
  }
}
