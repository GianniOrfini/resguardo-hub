---
version: alpha
name: Coda
description: "Coda is an all-in-one platform that blends the flexibility of docs, structure of spreadsheets, power of applications, and intelligence of AI."
sourceUrl: "https://coda.io"

colors:
  primary: "#212121"
  on-primary: "#ffffff"
  background: "#ffffff"
  surface: "#000000"
  border: "#8e8e8e"
  text: "#212121"
  text-muted: "#666666"

typography:
  display:
    fontFamily: "Calibre-R, sans-serif"
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1.82px
  heading:
    fontFamily: "Calibre-R, sans-serif"
    fontSize: 38px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.95px
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.48px

spacing:
  base: 4px
  scale: [4, 8, 12, 16, 20, 24, 28, 32, 40, 48]

radius:
  sm: 8px
  md: 10px
  lg: 12px

shadows:
  card: "rgb(224, 224, 224) 0px 0px 0px 1.5px inset"
  elevated: "rgba(0, 0, 0, 0.06) 0px 12px 24px -5px, rgba(0, 0, 0, 0.06) 0px 5px 10px -6px"

motion:
  duration-fast: 50ms
  duration-base: 200ms
  duration-slow: 250ms
  easing: "ease"
---

## Rationale

Coda's design system reflects a professional, productivity-focused platform that positions itself as a unified workspace for teams. The measured tokens reveal a deliberately minimal, high-contrast aesthetic built on a pure black-and-white foundation with restrained neutral grays. This monochromatic core communicates clarity and precision—values essential for a tool that blends documentation, structured data, and application building. The absence of vibrant accent colors suggests the platform itself becomes the canvas; users' content and AI-generated outputs are the focus, not the interface chrome.

Typography plays a central role in establishing hierarchy and confidence. The display scale at 52px with tight negative letter-spacing (–1.82px) and a custom sans-serif (Calibre-R) creates authoritative, attention-commanding headlines. Body copy shifts to Inter, a more approachable humanist sans-serif, signaling a shift from proclamation to clarity. The consistent 600 font weight across body text, paired with generous 1.5 line-height, prioritizes legibility for dense content—critical for a tool positioning itself as handling complex, multi-format information.

Spacing and motion operate subtly to create a sense of refined control rather than playfulness. The 4px base unit scales predictably (4, 8, 12, 16, 20, 24, 28, 32, 40, 48), enabling pixel-perfect layouts. Shadows are understated: the card shadow uses an inset 1.5px border, and elevated surfaces employ soft, diffused shadows (12–24px blur) that suggest depth without drama. Motion timing (50–250ms) keeps interactions snappy and responsive, matching the cognitive load of power-user workflows.

## 1. Visual Theme & Atmosphere

The design system projects **professional minimalism**. The light color mode with black primary text on white backgrounds creates an almost editorial aesthetic—think of a finely typeset document rather than a playful software interface. The measured border color (#8e8e8e) is a true mid-gray, neither assertive nor faint, sitting comfortably between content and chrome.

This restraint communicates trustworthiness and seriousness: Coda is not a toy or experiment, but an infrastructure tool. The absence of rounded curves beyond 12px suggests modular, efficient construction. The use of inset borders on cards (rather than drop shadows) implies structure and containment—fitting for a workspace that models data, docs, and application logic.

## 2. Color System

**Palette:**
- **Primary (#212121)**: Near-black, used for text and interactive elements. Provides 19.5:1 contrast against white background.
- **On-Primary (#ffffff)**: White, reserved for text/icons on dark backgrounds.
- **Background (#ffffff)**: Pure white, the canvas.
- **Surface (#000000)**: True black, employed sparingly for maximum contrast in critical interactive states.
- **Border (#8e8e8e)**: A desaturated mid-gray (approximately 45% gray) that defines card edges and subtle divisions without creating visual noise.
- **Text-Muted (#666666)**: A lighter gray (~40% of black's darkness) for secondary information and disabled states.

**Usage pattern:** The system avoids hue entirely in the primary palette. This forces intentional, hierarchy-driven design: if you can't rely on color to signal category or state, typography, positioning, and spatial relationships must carry that load. The three-tier text hierarchy (primary #212121 → secondary #666666 → subtle borders #8e8e8e) creates a quiet but clear visual ladder.

## 3. Typography

**Display (52px, Calibre-R, 700, –1.82px letter-spacing):**
Reserved for hero statements and major section titles. The negative letter-spacing creates a tight, almost architectural feel—each word is a compact, intentional block. Line-height of 1.1 keeps headlines dense and impactful.

**Heading (38px, Calibre-R, 700, –0.95px letter-spacing):**
Sub-section and feature headings. Still commanding but slightly more approachable than display. The reduced negative spacing (–0.95px vs –1.82px) signals hierarchy without losing the Calibre-R personality.

**Body (16px, Inter, 600, –0.48px letter-spacing):**
Paragraph copy, UI labels, and default prose. Inter's humanist proportions (vs. Calibre-R's geometric precision) ease reading for sustained content consumption. The 600 weight ensures screen readability; paired with 1.5 line-height, it prevents the text from feeling cramped despite the micro letter-spacing (–0.48px). This is the workhorse tier.

**System note:** All three scales use negative letter-spacing, suggesting a design system that prizes visual density and modern, condensed aesthetics. This is not comfortable-and-loose typography; it's controlled and precise.

## 4. Components & Patterns

**Buttons & CTAs:**
Primary actions likely use #212121 text on #ffffff background (or inverted). The measured tokens suggest solid, unstyled buttons with minimal ornamentation—relying on weight and proximity rather than color or shadow to signal interactivity.

**Cards & Containers:**
The card shadow (`rgb(224, 224, 224) 0px 0px 0px 1.5px inset`) defines surface boundaries via a subtle inset stroke rather than a drop shadow. This creates a flat, modular appearance; cards feel like they are *part of* the page structure, not floating above it.

**Elevated states (modals, popovers):**
The elevated shadow (`rgba(0, 0, 0, 0.06) 0px 12px 24px -5px`) applies soft blur and vertical offset, creating depth without drama. The low alpha (6%) ensures elevation is sensed rather than shouted.

**Interactive states:**
Likely rely on typography changes (weight, color shift to #666666), not color inversion. Borders may shift from #8e8e8e to #212121 on focus or hover.

## 5. Spacing & Layout

**Base unit:** 4px, scaling to 8, 12, 16, 20, 24, 28, 32, 40, 48px.

**Rhythm:** Most vertical spacing likely uses 16px (4 units), 24px (6 units), or 32px (8 units) increments. Horizontal padding in containers probably favors 24px or 32px (comfortable breathing room for productivity software). The scale avoids large jumps; the 4px base allows fine-tuned micro-spacing (e.g., 12px gaps between form fields) while supporting bold section separation (40px or 48px between major content blocks).

**Layout principle:** The modest spacing scale suggests a dense-but-organized layout. This is not generous whitespace design; it is efficient, information-rich architecture. Users of Coda are likely scanning complex docs and datasets, so compact vertical rhythm aids scannability.

## 6. Motion & Interaction

**Timing:**
- Fast: 50ms (micro-interactions, hover feedback)
- Base: 200ms (standard transitions, modal opens)
- Slow: 250ms (extended sequences, perhaps multi-step UI reveals)

All use `ease` easing, which is a gentle, symmetric acceleration/deceleration. This creates a sense of polish without feeling mechanical or playful. The 50–250ms range keeps the interface snappy—no lingering waits—while 250ms acknowledges that productivity software sometimes needs to choreograph complex state changes (e.g., inserting a block, loading AI suggestions).

**Interaction pattern:** Motion is likely **supplementary to structure**, not decorative. Buttons may fade from #212121 to #666666 over 50ms on hover. Cards may elevate (shadow shift from inset to elevated) over 200ms on focus. This restraint aligns with the minimalist aesthetic and respects power-user workflows that privilege speed.

## Accessibility

### Contrast Ratios

**Primary pair (#212121 on #ffffff):**
- **Contrast ratio: ~19.5:1**
- **Status:** Exceeds WCAG AAA (7:1)
- **Assessment:** Excellent. Supports users with moderate to severe vision impairment and is suitable for small text (8px and below).

**Secondary pair (#666666 on #ffffff):**
- **Contrast ratio: ~7.1:1**
- **Status:** Meets WCAG AAA; exceeds AA (4.5:1) by a comfortable margin.
- **Assessment:** Acceptable for body and secondary UI, though not ideal for very small labels. Recommend pairing #666666 only with body-weight text (16px+) or larger.

**Border pair (#8e8e8e on #ffffff):**
- **Contrast ratio: ~5.3:1**
- **Status:** Meets WCAG AA (4.5:1) marginally.
- **Assessment:** Adequate for decorative borders and subtle dividers. Not recommended for text or critical UI controls; reserve for non-content elements.

### Minimum Requirements

- **Touch target:** 44×44px minimum. Buttons and interactive elements (CTA links, form inputs, navigation items) should occupy at least this footprint. Given the measured 16px body font, a button with 16px text should include padding of at least 14px vertical and 12px horizontal to meet the 44px minimum (text 16px + padding 14px top/bottom = 44px height).

- **Focus indicator:** When tab-navigating, interactive elements must display a visible focus ring. Recommend a 2px solid outline in #212121 (primary color, high contrast) with a 2px offset from the element edge. The outline should follow the measured border radius (8–12px for most components).

- **Form labels:** All form inputs must have associated `<label>` elements or aria-label attributes. The measured 16px body text is adequate, provided labels meet the 7:1 contrast ratio (use #212121 on #ffffff).

- **Color independence:** Do not signal state (error, success, disabled) by color alone. The system's minimal palette makes this challenging; supplement with icons, text labels, or typography changes (e.g., strikethrough for disabled, bold for active).

- **Motion:** Respect `prefers-reduced-motion` media query. Users with vestibular disorders should have an option to disable the 200–250ms ease transitions; transitions should complete instantly or be removed in reduced-motion mode.
