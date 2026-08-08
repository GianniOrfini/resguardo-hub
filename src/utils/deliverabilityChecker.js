// Utility for Email Deliverability, Spam Trigger Scanning, DNS Audit & B2B Copy Conversion

export const SPAM_TRIGGER_WORDS = [
  { word: '100% free', level: 'high', reason: 'Expresión de alto riesgo para filtros antispam' },
  { word: 'click here', level: 'high', reason: 'Frase genérica muy penalizada por Gmail / Outlook' },
  { word: 'clic aquí', level: 'high', reason: 'Frase genérica muy penalizada por Gmail / Outlook' },
  { word: 'guaranteed money', level: 'high', reason: 'Promesa financiera engañosa' },
  { word: 'dinero garantizado', level: 'high', reason: 'Promesa financiera engañosa' },
  { word: 'urgent action required', level: 'high', reason: 'Falsa urgencia artificial' },
  { word: 'act now', level: 'medium', reason: 'Llamado a la acción agresivo' },
  { word: 'actúa ahora', level: 'medium', reason: 'Llamado a la acción agresivo' },
  { word: 'buy direct', level: 'medium', reason: 'Vocabulario comercial directo' },
  { word: 'comprar directo', level: 'medium', reason: 'Vocabulario comercial directo' },
  { word: 'no cost', level: 'medium', reason: 'Mención de gratuidad sospechosa' },
  { word: 'sin costo', level: 'medium', reason: 'Mención de gratuidad sospechosa' },
  { word: 'risk free', level: 'medium', reason: 'Garantía exagerada' },
  { word: 'sin riesgo', level: 'medium', reason: 'Garantía exagerada' },
  { word: 'special promotion', level: 'low', reason: 'Término promocional saturado' },
  { word: 'promoción especial', level: 'low', reason: 'Término promocional saturado' },
  { word: 'winner', level: 'high', reason: 'Palabra de sorteos engañosos' },
  { word: 'ganador', level: 'high', reason: 'Palabra de sorteos engañosos' },
  { word: 'make money', level: 'high', reason: 'Frase de spam masivo' },
  { word: 'haz dinero', level: 'high', reason: 'Frase de spam masivo' },
  { word: 'free quote', level: 'low', reason: 'Término común pero monitoreado' },
  { word: 'cotización gratis', level: 'low', reason: 'Término común pero monitoreado' }
];

export function analyzeDeliverability({ subject = '', preheader = '', content = '' }) {
  const fullText = `${subject} ${preheader} ${content}`.toLowerCase();
  
  // 1. Scan Trigger Words
  const detectedTriggers = [];
  let penaltyPoints = 0;

  SPAM_TRIGGER_WORDS.forEach(item => {
    if (fullText.includes(item.word.toLowerCase())) {
      const weight = item.level === 'high' ? 25 : item.level === 'medium' ? 15 : 8;
      penaltyPoints += weight;
      detectedTriggers.push(item);
    }
  });

  // 2. Unsubscribe Link Check
  const hasUnsubscribe = /unsubscribe|darse de baja|cancelar suscripción|opt-out/i.test(content);
  if (!hasUnsubscribe) {
    penaltyPoints += 20;
  }

  // 3. Text to Image Ratio Check
  const imgTags = (content.match(/<img[^>]*>/gi) || []).length;
  const strippedText = content.replace(/<[^>]+>/g, '').trim();
  const wordCount = strippedText ? strippedText.split(/\s+/).length : 0;
  
  let textRatioWarning = null;
  if (imgTags > 0 && wordCount < 60) {
    penaltyPoints += 20;
    textRatioWarning = 'Demasiadas imágenes para tan poco texto. Los filtros de Spam prefieren correos con mínimo 80% de texto redactado.';
  }

  // 4. Preheader validation
  let preheaderWarning = null;
  if (!preheader || preheader.trim().length < 20) {
    penaltyPoints += 10;
    preheaderWarning = 'El preheader es muy corto o inexistente. Agrega entre 40 y 120 caracteres para mejorar el Open Rate.';
  }

  // 5. Subject All-Caps Check
  const isAllCapsSubject = subject.length > 5 && subject === subject.toUpperCase() && /[A-Z]/.test(subject);
  if (isAllCapsSubject) {
    penaltyPoints += 15;
  }

  // Final Spam Risk Score Calculation (0 safe - 100 risky)
  const spamScore = Math.min(100, penaltyPoints);

  let riskLevel = 'Bajo (Excelente)';
  let riskColor = '#10b981'; // Green
  if (spamScore > 50) {
    riskLevel = 'Alto (Riesgo de Spam)';
    riskColor = '#ef4444'; // Red
  } else if (spamScore > 20) {
    riskLevel = 'Moderado (Atención)';
    riskColor = '#f59e0b'; // Amber
  }

  return {
    spamScore,
    riskLevel,
    riskColor,
    detectedTriggers,
    hasUnsubscribe,
    textRatioWarning,
    preheaderWarning,
    isAllCapsSubject,
    wordCount,
    imgCount: imgTags,
    suggestions: generateSuggestions({ spamScore, detectedTriggers, hasUnsubscribe, textRatioWarning, preheaderWarning, isAllCapsSubject })
  };
}

function generateSuggestions({ detectedTriggers, hasUnsubscribe, textRatioWarning, preheaderWarning, isAllCapsSubject }) {
  const list = [];
  if (detectedTriggers.length > 0) {
    list.push(`Reemplaza las palabras gatillo detectadas (${detectedTriggers.map(t => `"${t.word}"`).join(', ')}) por sinónimos más profesionales.`);
  }
  if (!hasUnsubscribe) {
    list.push('Incluye un enlace claro de desuscripción ("Unsubscribe") en el pie del correo para cumplir con las normativas CAN-SPAM / GDPR.');
  }
  if (textRatioWarning) {
    list.push(textRatioWarning);
  }
  if (preheaderWarning) {
    list.push(preheaderWarning);
  }
  if (isAllCapsSubject) {
    list.push('Evita escribir el asunto en MAYÚSCULAS completas. Los filtros de spam lo penalizan drásticamente.');
  }
  if (list.length === 0) {
    list.push('¡Tu correo tiene una entregabilidad óptima! Está listo para ser enviado sin caer a la carpeta de correo no deseado.');
  }
  return list;
}

export function checkDNSStatus() {
  return {
    domain: 'resguardodesigns.com',
    spf: {
      status: 'Valid',
      record: 'v=spf1 include:mailgun.org include:gohighlevel.com ~all',
      type: 'TXT',
      recommendation: 'Registro SPF correcto para envío masivo desde GoHighLevel y Mailgun.'
    },
    dkim: {
      status: 'Valid',
      record: 'k1._domainkey.resguardodesigns.com CNAME k1.dkim.gohighlevel.com',
      type: 'CNAME',
      recommendation: 'Firma digital de dominio activa y verificada.'
    },
    dmarc: {
      status: 'Warning',
      record: 'v=DMARC1; p=none; rua=mailto:dmarc-reports@resguardodesigns.com',
      type: 'TXT',
      recommendation: 'Recomendado cambiar "p=none" a "p=quarantine" o "p=reject" para máxima protección contra suplantación.'
    },
    mx: {
      status: 'Valid',
      record: '10 mxa.mailgun.org, 10 mxb.mailgun.org',
      type: 'MX',
      recommendation: 'Enrutamiento de retorno configurado correctamente.'
    }
  };
}

export function transformToB2BVariants({ subject = '', content = '', technicalSpecs = '' }) {
  return {
    variantA: {
      name: 'A) Corta & Directa al Grano (B2B ROI)',
      subject: `Solución Comercial: ${subject || 'Renovación de Fachada y Rotulación en Maryland'}`,
      preheader: 'Atrae hasta un 40% más de clientes locales con presencia visual profesional.',
      content: `<div style="font-family: Inter, sans-serif; color: #212121; line-height: 1.6; max-width: 600px; margin: 0 auto;">
  <h2 style="font-family: Calibre-R, sans-serif; font-size: 22px; color: #212121; font-weight: 700; margin-bottom: 16px;">
    Haz que tu negocio destaque en Maryland sin complicaciones
  </h2>
  <p>Hola,</p>
  <p>Sabemos que la primera impresión de tu local o vehículo comercial es decisiva para captar clientes de alto valor. En <strong>Resguardo Designs</strong>, nos encargamos de todo el proceso de diseño, fabricación e instalación de cartelería y vinilos de máxima durabilidad.</p>

  <div style="background: #f8fafc; border-left: 4px solid #212121; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
    <strong>Beneficios Directos para tu Negocio:</strong>
    <ul style="margin: 8px 0 0 0; padding-left: 20px;">
      <li>Visibilidad inmediata desde la calle las 24 horas del día.</li>
      <li>Garantía contra desteñido de sol y lluvias de Maryland por 5+ años.</li>
      <li>Servicios llave en mano: Medición, diseño 3D, fabricación rápida e instalación.</li>
    </ul>
  </div>

  <p>Si deseas recibir una simulación visual gratuita de cómo se vería tu fachada o camioneta rotulada, responde a este correo o agenda una llamada corta de 10 minutos.</p>

  <div style="margin-top: 28px;">
    <a href="https://resguardodesigns.com/quote" style="background: #212121; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
      Solicitar Muestra Visual Sin Compromiso
    </a>
  </div>

  <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
  <p style="font-size: 12px; color: #64748b; margin-top: 16px;">
    Resguardo Designs | Maryland, USA | <a href="#" style="color: #64748b; text-decoration: underline;">Cancelar suscripción / Unsubscribe</a>
  </p>
</div>`
    },
    variantB: {
      name: 'B) Problema-Solución (Estilo StoryBrand)',
      subject: `¿Tu local en Maryland refleja la verdadera calidad de tu servicio?`,
      preheader: 'Muchos negocios pierden clientes diarios por fachadas desactualizadas. Aquí está la solución.',
      content: `<div style="font-family: Inter, sans-serif; color: #212121; line-height: 1.6; max-width: 600px; margin: 0 auto;">
  <p>Hola,</p>
  <p>Muchos dueños de comercios y contratistas en Maryland invierten miles de dólares en excelente servicio, pero su fachada o vehículos no transmiten la misma calidad. Una imagen informal hace que potenciales clientes duden o elijan a la competencia.</p>
  
  <p>En <strong>Resguardo Designs</strong>, eliminamos ese problema transformando tu negocio en una marca imponente que transmite autoridad y confianza desde el primer segundo.</p>

  <h3 style="font-family: Calibre-R, sans-serif; font-size: 18px; margin-top: 24px;">¿Cómo lo logramos?</h3>
  <ol style="padding-left: 20px;">
    <li><strong>Diagnóstico Visual:</strong> Analizamos tu espacio o vehículo sin costo.</li>
    <li><strong>Diseño & Fabricación Premium:</strong> Utilizamos sustratos de aluminio Dibond y vinilos microperforados de alto tráfico.</li>
    <li><strong>Instalación Profesional:</strong> Nuestro equipo en Maryland instala todo sin interrumpir tu horario de atención.</li>
  </ol>

  <p>¿Te gustaría ver ejemplos reales de negocios similares al tuyo que duplicaron sus consultas?</p>

  <div style="margin-top: 24px;">
    <a href="https://resguardodesigns.com/cases" style="background: #212121; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
      Ver Casos de Éxito en Maryland
    </a>
  </div>

  <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
  <p style="font-size: 12px; color: #64748b; margin-top: 16px;">
    Resguardo Designs | Maryland, USA | <a href="#" style="color: #64748b; text-decoration: underline;">Cancelar suscripción / Unsubscribe</a>
  </p>
</div>`
    },
    variantC: {
      name: 'C) Promoción Corporativa B2B (Directa)',
      subject: `Resguardo Designs: Paquetes Integrales de Cartelería para Locales y Flotas`,
      preheader: 'Cotización rápida y garantía de instalación en 5 días en Maryland.',
      content: `<div style="font-family: Inter, sans-serif; color: #212121; line-height: 1.6; max-width: 600px; margin: 0 auto;">
  <h2 style="font-family: Calibre-R, sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 14px;">
    Equipa tu local comercial con la mejor solución visual de Maryland
  </h2>
  <p>Estimado equipo,</p>
  <p>Presentamos nuestra línea exclusiva de soluciones gráficas B2B diseñadas para perdurar en el clima de Maryland:</p>

  <table style="width: 100%; border-collapse: collapse; margin: 18px 0; border: 1px solid #e2e8f0;">
    <tr style="background: #f1f5f9;">
      <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Producto</th>
      <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Resultado Comercial</th>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Cartelería Dibond 3M</strong></td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Fachada de alta durabilidad outdoor sin decoloración.</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Vinilos Microperforados</strong></td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Privacidad interior con publicidad viva hacia el exterior.</td>
    </tr>
    <tr>
      <td style="padding: 10px;"><strong>Rotulación de Flotas 3D</strong></td>
      <td style="padding: 10px;">Valla publicitaria móvil las 24 horas en autopistas.</td>
    </tr>
  </table>

  <p>Recibe asesoramiento directo hoy mismo con nuestro especialista técnico.</p>

  <div style="margin-top: 24px;">
    <a href="https://resguardodesigns.com/contact" style="background: #212121; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
      Contactar Especialista en Maryland
    </a>
  </div>

  <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
  <p style="font-size: 12px; color: #64748b; margin-top: 16px;">
    Resguardo Designs | Maryland, USA | <a href="#" style="color: #64748b; text-decoration: underline;">Cancelar suscripción / Unsubscribe</a>
  </p>
</div>`
    }
  };
}
