# Specification & Developer Roadmap: Resguardo AI Operations Dashboard

**Documento Maestro de Arquitectura y Hoja de Ruta para Agente Programador IA**  
**Proyecto:** Resguardo Dashboard Gianni  
**Ruta del Repositorio:** `/Users/gianni/Documents/Proyectos/Resguardo Dashboard Gianni`  
**Stack Tecnológico Base:** React 18, Vite, Tailwind CSS, Lucide Icons, Dexie.js (IndexedDB local storage), Supabase / Vercel API.  
**Sistema de Diseño:** Coda.io Monochromatic Aesthetic (`coda-DESIGN.md` — Alto contraste, tipografía Calibre-R / Inter, bordes inset, visualidad profesional de alta densidad).

---

## OVERVIEW & CORE PHILOSOPHY

Este dashboard es el **centro de mando operativo de Gianluca** para automatizar, escalar y sistematizar el trabajo en **Resguardo Designs** (Maryland, USA). 

El sistema persigue 3 objetivos fundamentales:
1. **Eliminar el 90% del trabajo manual repetitivo** (redacción de blogs, emails de marketing, tareas de soporte).
2. **Eliminar el "AI Slop"**: La IA **NUNCA** genera diseños web o textos genéricos descontextualizados. Todo se basa en componentes UI pre-curados de alto gusto y copiar estructurado en JSON.
3. **Escalar la Facturación de Resguardo**: Ofrecer landing pages de $1.000+ USD con presentación visual impecable para Ana (Jefa de Resguardo) y clientes B2B.

---

## 🏗️ MÓDULOS DE ARQUITECTURA Y HOJA DE RUTA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       RESGUARDO DASHBOARD GIANNI                            │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│ MÓDULO 1:       │ MÓDULO 2:       │ MÓDULO 3:       │ MÓDULO 4:             │
│ EMAIL & SPAM    │ WEB GENERATOR   │ ENCICLOPEDIA &  │ CENTRALIZADOR &       │
│ ENGINE          │ ("NO AI SLOP")  │ KNOWLEDGE BASE  │ GHL/TRELLO KPIs       │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

---

## MÓDULO 1: EMAIL MARKETING & DELIVERABILITY ENGINE (Urgencia Alta)

### 1.1 Problema a Resolver
- Los correos actuales suenan "muy técnicos" para Ana. Necesitan un tono **humano, cercano, orientado a beneficios comerciales B2B** para dueños de locales en Maryland (cartelería, gráfica, logística).
- Los correos caen a la carpeta de **SPAM** en los clientes.

### 1.2 Especificación para el Agente Programador
- **Componente Objetivo:** `src/components/EmailContentEditor.jsx` & `src/components/EmailHistoryAI.jsx`.
- **Integración de Motor Anti-Spam (Deliverability Checker)**:
  - Crear un helper utilitario `src/utils/deliverabilityChecker.js` que analice el contenido del mail antes de guardarlo o enviarlo.
  - **Filtro de Palabras Gatillo de Spam**: Escanear expresiones riesgosas (`100% free`, `click here`, `guaranteed money`, `urgent action required`, etc.).
  - **Auditoría de Formato**: Validar ratio texto-imagen (mínimo 80% texto, 20% imagen), presencia de enlace de desuscripción y longitud del pre-header.
  - **Asistente de DNS / SPF / DKIM / DMARC**: Panel dentro del dashboard que muestre el estado de los registros DNS del dominio de Resguardo y dé las instrucciones exactas de configuración en Cloudflare/GoDaddy.
- **Asistente de Tono B2B (Filtro Anti-Técnico)**:
  - Cargar el historial de emails pasados (que Gianni ya guardó en la DB).
  - Prompt del Agente Redactor: *"Transforma cualquier especificación técnica (ej. vinilo microperforado 3M, impresión solvente 1440dpi) en un beneficio de negocio directo (ej. 'Cartelería para tu fachada que atrae clientes desde 100 metros de distancia sin desteñirse con el sol')."*
  - Generar siempre 3 variantes por campaña: (A) Corta/Directa, (B) Problema-Solución (StoryBrand), (C) Promoción Directa.

---

## MÓDULO 2: GENERADOR WEB ÁGIL DE ALTO GUSTO ("NO AI SLOP")

### 2.1 Especificación de la Pipeline de 5 Fases
- **Componente Objetivo:** `src/components/AgileWebGenerator.jsx`.

#### FASE 1: Scraping y Extracción de Contexto
- **Backend/API Worker:** Conectar script con Playwright / SingleFile / Crawlee.
- **Acción:** Ingresar URL previa del cliente o usuario de Instagram/Facebook.
- **Extraer:** 
  1. Bio, publicaciones recientes e imágenes de perfil/productos (descarga a storage local/R2).
  2. Comentarios de clientes -> Procesamiento en lote para extraer: puntos de dolor, frases de elogio (testimonios) y tono del público.

#### FASE 2: Documento Maestro de Copy (JSON Estructurado con Zod)
- **Regla:** La IA **NUNCA** genera texto libre. Devuelve un esquema JSON estricto:
  ```ts
  interface MasterCopySchema {
    hero: { headline: string; subheadline: string; ctaText: string };
    valueProps: { title: string; description: string; iconName: string }[];
    problemAgitation: { problemTitle: string; points: string[] };
    socialProof: { quote: string; author: string; company: string }[];
    faq: { question: string; answer: string }[];
  }
  ```

#### FASE 3: Enciclopedia de Componentes Propios
- **Estructura de Carpetas:** `src/components/ui-blocks/`
  - `heroes/`: CleanHero, VideoHero, SplitHero.
  - `bentos/`: FeatureBento, MetricBento.
  - `forms/`: LeadCaptureForm, QuoteCalculator.
  - `footers/`: MinimalFooter, DetailedFooter.
- **Stack:** Tailwind CSS + Lucide Icons + Framer Motion (basado en Shadcn UI + Aceternity UI).

#### FASE 4: Inteligencia Competitiva Visual
- **Acción:** Buscar 20 competidores locales (vía Google Places API / Web Search).
- **Visualizador:** Generar thumbnails con Playwright y desplegar una grilla visual para que Gianni inspeccione los sitios de los competidores directamente en el Dashboard.

#### FASE 5: Motor de Generación Multivariante (6 Propuestas)
- **Generador:** Inyecta el Copy JSON en 6 combinaciones de componentes de la Enciclopedia.
  - 3 variantes basadas en la idea directa de Gianni.
  - 3 variantes basadas en superar a la competencia analizada.
- **Theme Switcher:** Cambio instantáneo de paleta de colores CSS `:root` (monocromático Coda, dark mode industrial, accent corporativo).

---

## MÓDULO 3: ENCICLOPEDIA & BASE DE CONOCIMIENTOS DE RESGUARDO

### 3.1 Especificación
- **Componente Objetivo:** `src/components/ResguardoEncyclopedia.jsx` (Nuevo Módulo).
- **Propósito:** Base de datos viva donde se almacena el ADN de Resguardo:
  - Lista de productos de cartelería y logística con precios, tiempos de producción y especificaciones.
  - Perfiles de clientes ideales en Maryland (ej: restaurantes, locales de ropa, oficinas, contratistas).
  - Diccionario de frases de marca autorizadas y palabras prohibidas.
- **Uso:** Todos los agentes del dashboard (Email Agent, Blog Agent, Web Agent) consultan este módulo antes de generar cualquier texto.

---

## MÓDULO 4: CENTRALIZADOR DE TAREAS & KPIs (GHL + TRELLO)

### 4.1 Especificación
- **Componente Objetivo:** `src/components/TaskCentralizer.jsx` & `src/components/YearlyGallery.jsx`.
- **Integraciones:**
  - **Trello API:** Sincronización bidireccional de tableros de producción y soporte de Resguardo.
  - **GoHighLevel API:** Métricas de conversión de campañas de email y leads generados.
- **Métricas a Desplegar (KPIs para Ana)**:
  - Tasa de apertura de mails (Open Rate).
  - Tasa de clics (CTR).
  - Mails marcados como Spam (Target: < 0.1%).
  - Páginas web entregadas y tiempo promedio de desarrollo.

---

## 🛠️ PLAN DE EJECUCIÓN PASO A PASO PARA EL AGENTE PROGRAMADOR

### FASE I: REFUERZO DEL MOTOR DE EMAILS Y ENTREGABILIDAD (Inmediato)
1. Crear `src/utils/deliverabilityChecker.js` con algoritmo de detección de palabras spammy y reglas de formato.
2. Actualizar `EmailContentEditor.jsx` para mostrar un **"Spam Risk Gauge"** (Medidor de riesgo de spam) en tiempo real al editar o generar correos.
3. Crear el componente `DNSStatusModal.jsx` con la guía visual de registros SPF/DKIM/DMARC.

### FASE II: SISTEMA DE COMPONENTES UI Y AGILE WEB GENERATOR
1. Crear la carpeta `src/components/ui-blocks/` e integrar los primeros 6 bloques de alto gusto (Hero, Bento, Features, Forms, FAQ, Footer).
2. Conectar `AgileWebGenerator.jsx` para que acepte el Copy JSON y renderice dinámicamente las 6 variantes visuales con selector de temas Tailwind.

### FASE III: BASE DE CONOCIMIENTO & INTEGRACIÓN GHL/TRELLO
1. Crear la pestaña `ResguardoEncyclopedia.jsx` en la Sidebar.
2. Configurar los webhooks o endpoints de API para Trello y GoHighLevel.

---

## 🎨 REGLAS DE DISEÑO UI/UX OBLIGATORIAS (Coda.io Design System)

- **Colores:** Primario `#212121`, Fondo `#ffffff`, Bordes `#8e8e8e` (o `inset 1.5px`), Muted `#666666`.
- **Tipografía:** Títulos en `Calibre-R` / `sans-serif` con letter-spacing negativo (-1px); Cuerpo en `Inter` (font weight 600, line-height 1.5).
- **Animaciones:** Snappy y rápidas (50ms micro-interacciones, 200ms modales).
- **Cero Adornos Innecesarios:** Diseño denso, limpio, profesional e informativo.
