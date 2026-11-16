/**
 * SISTEMA DE CONTROL DE ACCESO MILITAR - EJÉRCITO DEL PERÚ (EP)
 * Módulo de Lógica de Simulación y Motores Biométricos / Reconocimiento de Voz
 * Dirección de Telemática y Estadística (DITE) - Puesto de Control y Prevención
 */

class TacticalSoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBeep(freq = 880, duration = 0.08, type = 'sine') {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    [587.33, 739.99, 880].forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.18);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.2);
    });
  }

  playAlert() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now + i * 0.18);
      osc.frequency.exponentialRampToValueAtTime(140, now + i * 0.18 + 0.14);
      gain.gain.setValueAtTime(0.2, now + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.16);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 0.17);
    }
  }

  playLaserScan() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.25);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

class EPDatabaseService {
  constructor() {
    this.personnel = [
      {
        id: "EP-01",
        cip: "318492010",
        dni: "45892104",
        grado: "Coronel EP",
        grado_abreviado: "CRL EP",
        arma_servicio: "Infantería",
        apellidos: "VÁSQUEZ HUAMÁN",
        nombres: "Carlos Alberto",
        unidad_actual: "Comandancia General del Ejército (CGE)",
        cargo: "Jefe de Estado Mayor Operativo",
        nivel_seguridad: "SECRETO_MILITAR_NIVEL_3",
        estado_autorizacion: "AUTORIZADO",
        nivel_alerta: "VERDE_DEFCON_5",
        foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
        porte_arma_reglamentaria: {
          autorizado: true,
          serie_arma: "PIST-P226-EP-88412",
          municion_dotacion: "30 tiros 9x19mm"
        },
        destino_predeterminado: "Cuartel General del Ejército - Pabellón A (EMGE)",
        vehiculo_autorizado: "EP-41029 (Toyota Hilux 4x4 Verde OTAN)",
        tipo_pase: "PERMANENTE_OFICIAL_SUPERIOR",
        observaciones_guardia: "Pase prioritario sin restricción horaria. Escolta autorizada."
      },
      {
        id: "EP-02",
        cip: "409281745",
        dni: "72948102",
        grado: "Técnico 1ra EP",
        grado_abreviado: "T1 EP",
        arma_servicio: "Material de Guerra",
        apellidos: "QUISPE MAMANI",
        nombres: "Edwin Wilfredo",
        unidad_actual: "Batallón de Material de Guerra N° 511",
        cargo: "Jefe de Polvorín y Armamento",
        nivel_seguridad: "CONFIDENCIAL",
        estado_autorizacion: "AUTORIZADO",
        nivel_alerta: "VERDE_DEFCON_5",
        foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces",
        porte_arma_reglamentaria: {
          autorizado: true,
          serie_arma: "PIST-GLOCK17-EP-45190",
          municion_dotacion: "17 tiros 9mm"
        },
        destino_predeterminado: "Depósito General de Pertrechos Militares",
        vehiculo_autorizado: "EP-89112 (Camión Táctico Unimog)",
        tipo_pase: "PERMANENTE_TECNICO",
        observaciones_guardia: "Verificar sello de comisión de servicio en Prevención."
      },
      {
        id: "EP-03",
        cip: "294817200",
        dni: "09482711",
        grado: "Ex-Capitán EP (En Situación de Retiro)",
        grado_abreviado: "CAP EP (R)",
        arma_servicio: "Comunicaciones",
        apellidos: "MENDOZA RETAMOZO",
        nombres: "Jorge Luis",
        unidad_actual: "Ninguna / Fuera de Cuadro",
        cargo: "Sin Asignación",
        nivel_seguridad: "ACCESO_RESTRINGIDO",
        estado_autorizacion: "DENEGADO_ALERTA_TACTICA",
        nivel_alerta: "ROJO_INMEDIATO",
        foto_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&crop=faces",
        porte_arma_reglamentaria: {
          autorizado: false,
          serie_arma: "SIN AUTORIZACIÓN",
          municion_dotacion: "0"
        },
        motivo_restriccion: {
          codigo_incidente: "ORD-JUD-EP-2026-089",
          descripcion: "ORDEN DE IMPEDIMENTO DE ACCESO A INSTALACIONES MILITARES E INVESTIGACIÓN EN CURSO POR INSPECTORÍA GENERAL DEL EJÉRCITO (IGE).",
          acciones_oficial_guardia: [
            "Retener documento de identidad o CIP de inmediato.",
            "Aislar al intervenido en la Sala de Prevención.",
            "Notificar al Oficial de Guardia y activar Código Rojo.",
            "Comunicar de inmediato al Batallón de Policía Militar N° 501."
          ],
          notificar_oficial_guardia: true,
          prioridad_llamada: "ALTA_INMEDIATA"
        },
        destino_predeterminado: "ACCESO PROHIBIDO",
        tipo_pase: "REVOCADO"
      },
      {
        id: "EP-04",
        cip: "510928374",
        dni: "76192834",
        grado: "Subteniente EP",
        grado_abreviado: "STTE EP",
        arma_servicio: "Artillería",
        apellidos: "FLORES SALAZAR",
        nombres: "Valeria Andrea",
        unidad_actual: "Grupo de Artillería de Campaña N° 115",
        cargo: "Comandante de Batería de Fuegos",
        nivel_seguridad: "SECRETO_MILITAR_NIVEL_2",
        estado_autorizacion: "AUTORIZADO",
        nivel_alerta: "VERDE_DEFCON_5",
        foto_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces",
        porte_arma_reglamentaria: {
          autorizado: true,
          serie_arma: "PIST-BERETTA-EP-3109",
          municion_dotacion: "15 tiros 9mm"
        },
        destino_predeterminado: "Polígono de Tiro y Prevención Sur",
        vehiculo_autorizado: "Particular / A pie",
        tipo_pase: "OFICIAL_SUBALTERNO",
        observaciones_guardia: "Presentación ordinaria de servicio matutino."
      }
    ];

    this.accessLogs = [];
    this.initCustomStorage();
  }

  initCustomStorage() {
    try {
      const saved = localStorage.getItem('sipre_bio_custom_personnel');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.length > 0) {
          // Prepend custom enrolled personnel
          this.personnel = [...list, ...this.personnel];
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar personal personalizado desde LocalStorage:", e);
    }
  }

  saveCustomPersonnel(person) {
    // Asegurar ID único
    if (!person.id) {
      person.id = "EP-BIO-" + Date.now().toString().slice(-5);
    }
    // Agregar a la lista en memoria
    this.personnel.unshift(person);

    try {
      const saved = localStorage.getItem('sipre_bio_custom_personnel');
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      list.unshift(person);
      localStorage.setItem('sipre_bio_custom_personnel', JSON.stringify(list));
    } catch (e) {
      console.warn("No se pudo persistir en LocalStorage:", e);
    }
    return person;
  }

  deleteCustomPersonnel(id) {
    this.personnel = this.personnel.filter(p => p.id !== id);
    try {
      const saved = localStorage.getItem('sipre_bio_custom_personnel');
      if (saved) {
        let list = JSON.parse(saved);
        if (Array.isArray(list)) {
          list = list.filter(p => p.id !== id);
          localStorage.setItem('sipre_bio_custom_personnel', JSON.stringify(list));
        }
      }
    } catch (e) {
      console.warn("Error eliminando personal:", e);
    }
  }

  findByCIP(cip) {
    if (!cip) return null;
    return this.personnel.find(p => p.cip && p.cip.trim() === cip.trim());
  }

  findByDNI(dni) {
    if (!dni) return null;
    return this.personnel.find(p => p.dni && p.dni.trim() === dni.trim());
  }

  search(term) {
    if (!term) return [];
    const q = term.trim().toLowerCase();
    return this.personnel.filter(p => 
      (p.cip && p.cip.toLowerCase().includes(q)) ||
      (p.dni && p.dni.toLowerCase().includes(q)) ||
      (p.apellidos && p.apellidos.toLowerCase().includes(q)) ||
      (p.nombres && p.nombres.toLowerCase().includes(q)) ||
      (p.vehiculo_autorizado && p.vehiculo_autorizado.toLowerCase().includes(q)) ||
      (p.grado_abreviado && p.grado_abreviado.toLowerCase().includes(q))
    );
  }

  logAccess(record) {
    const logEntry = {
      id: "LOG-" + Date.now().toString().slice(-6),
      timestamp: new Date().toLocaleTimeString('es-PE', { hour12: false }),
      fecha: new Date().toLocaleDateString('es-PE'),
      ...record
    };
    this.accessLogs.unshift(logEntry);
    return logEntry;
  }
}

/**
 * MOTOR DE RECONOCIMIENTO FACIAL Y DETECCIÓN DE VIDA (LIVENESS)
 */
class FacialLivenessEngine {
  constructor(canvasElement, statusElement, onStateChange) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.statusElem = statusElement;
    this.onStateChange = onStateChange;
    this.isScanning = false;
    this.animationFrameId = null;
    this.simulatedFaceAngles = { pitch: 0, yaw: 0, roll: 0 };
    this.scanProgress = 0;
    this.livenessChecks = {
      faceDetected: false,
      blinkDetected: false,
      headTurnDetected: false,
      antiSpoofPassed: false
    };
  }

  startSimulation(personTarget, onComplete) {
    if (this.isScanning) return;
    this.isScanning = true;
    this.scanProgress = 0;
    this.livenessChecks = {
      faceDetected: false,
      blinkDetected: false,
      headTurnDetected: false,
      antiSpoofPassed: false
    };

    const startTime = performance.now();
    const duration = 3200; // 3.2s comprehensive scan

    const runLoop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      this.scanProgress = progress;

      // Update tactical status states as specified
      if (progress < 40) {
        this.updateStatus("[ESCANEANDO ROSTRO ENCUADRADO...]", "amber");
        this.livenessChecks.faceDetected = true;
      } else if (progress < 70) {
        this.updateStatus("[PRUEBA DE VIDA: PARPADEO Y GIRO CONFIRMADO]", "blue");
        this.livenessChecks.blinkDetected = true;
        this.livenessChecks.headTurnDetected = true;
      } else if (progress < 90) {
        this.updateStatus("[VERIFICANDO EN BASE DE DATOS EP (DITE)...]", "yellow");
        this.livenessChecks.antiSpoofPassed = true;
      } else {
        const isAuth = personTarget.estado_autorizacion === "AUTORIZADO";
        this.updateStatus(
          isAuth ? "[ACCESO CONCEDIDO: IDENTIDAD MILITAR VALIDADA]" : "[ALERTA: ACCESO DENEGADO / IMPEDIMENTO]",
          isAuth ? "green" : "red"
        );
      }

      this.renderTacticalHUD(progress, personTarget);

      if (progress < 100 && this.isScanning) {
        this.animationFrameId = requestAnimationFrame(runLoop);
      } else {
        this.isScanning = false;
        if (onComplete) {
          onComplete({
            success: personTarget.estado_autorizacion === "AUTORIZADO",
            person: personTarget,
            livenessScore: 0.988,
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    this.animationFrameId = requestAnimationFrame(runLoop);
  }

  stop() {
    this.isScanning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  updateStatus(text, colorKey) {
    if (this.statusElem) {
      this.statusElem.innerText = text;
      this.statusElem.dataset.statusColor = colorKey;
    }
    if (this.onStateChange) {
      this.onStateChange(text, colorKey);
    }
  }

  renderTacticalHUD(progress, personTarget) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    // Oval Guide Center Dimensions
    const cx = width / 2;
    const cy = height / 2 - 10;
    const rx = width * 0.28;
    const ry = height * 0.38;

    // Tactical Oval Guide Lines
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = progress > 85 ? (personTarget.estado_autorizacion === "AUTORIZADO" ? "#4CAF50" : "#B71C1C") : "#4ade80";
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Military Corner Reticles
    const boxMargin = 30;
    const cornerSize = 25;
    ctx.save();
    ctx.strokeStyle = "#DAA520"; // Military Amber / Gold
    ctx.lineWidth = 2;
    
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(boxMargin, boxMargin + cornerSize);
    ctx.lineTo(boxMargin, boxMargin);
    ctx.lineTo(boxMargin + cornerSize, boxMargin);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - boxMargin - cornerSize, boxMargin);
    ctx.lineTo(width - boxMargin, boxMargin);
    ctx.lineTo(width - boxMargin, boxMargin + cornerSize);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(boxMargin, height - boxMargin - cornerSize);
    ctx.lineTo(boxMargin, height - boxMargin);
    ctx.lineTo(boxMargin + cornerSize, height - boxMargin);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - boxMargin - cornerSize, height - boxMargin);
    ctx.lineTo(width - boxMargin, height - boxMargin);
    ctx.lineTo(width - boxMargin, height - boxMargin - cornerSize);
    ctx.stroke();
    ctx.restore();

    // Dynamic Vertical Laser Scan Line
    const scanY = cy - ry + ((progress % 50) / 50) * (ry * 2);
    ctx.save();
    const grad = ctx.createLinearGradient(cx - rx, scanY, cx + rx, scanY);
    grad.addColorStop(0, "rgba(74, 222, 128, 0)");
    grad.addColorStop(0.5, "rgba(74, 222, 128, 0.85)");
    grad.addColorStop(1, "rgba(74, 222, 128, 0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - rx * 0.9, scanY);
    ctx.lineTo(cx + rx * 0.9, scanY);
    ctx.stroke();
    ctx.restore();

    // Face Vector Feature Points (Landmarks)
    if (progress > 20) {
      ctx.save();
      ctx.fillStyle = "#86efac";
      const landmarks = [
        { x: cx - 35, y: cy - 25 }, // Left eye
        { x: cx + 35, y: cy - 25 }, // Right eye
        { x: cx, y: cy + 10 },      // Nose tip
        { x: cx - 24, y: cy + 50 }, // Mouth left
        { x: cx + 24, y: cy + 50 }, // Mouth right
        { x: cx, y: cy + 55 },      // Chin
        { x: cx - 55, y: cy - 40 }, // Left brow
        { x: cx + 55, y: cy - 40 }, // Right brow
      ];
      landmarks.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // Telemetry text overlay in HUD
    ctx.save();
    ctx.font = "10px 'Roboto Mono', monospace";
    ctx.fillStyle = "#DAA520";
    ctx.fillText(`FPS: 30.0 | LIVENESS: ${progress > 50 ? 'PASS (0.98)' : 'EVALUATING'}`, boxMargin + 4, boxMargin + 16);
    ctx.fillText(`SENSOR: IR/RGB-OPTICAL | PUESTO: GARITA-01`, boxMargin + 4, height - boxMargin - 8);
    ctx.restore();
  }
}

/**
 * MOTOR DE RECONOCIMIENTO DACTILAR
 */
class BiometricFingerprintEngine {
  constructor(canvasElement, onStateUpdate) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onStateUpdate = onStateUpdate;
    this.isScanning = false;
  }

  drawFingerprint(scanYPercent = 0, isMatch = null) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Draw fingerprint ridges (elliptical concentric arcs)
    ctx.save();
    let ridgeColor = "#4ade80"; // Neon tactical green
    if (isMatch === true) ridgeColor = "#22c55e";
    if (isMatch === false) ridgeColor = "#ef4444";

    ctx.strokeStyle = ridgeColor;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";

    const rings = 12;
    for (let i = 1; i <= rings; i++) {
      const rx = i * 9.5;
      const ry = i * 15;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0.25 * Math.PI, 1.75 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy + 5, rx * 0.9, ry * 0.9, 0, -0.2 * Math.PI, 0.4 * Math.PI);
      ctx.stroke();
    }

    // Laser bar
    if (scanYPercent > 0 && scanYPercent < 100) {
      const laserY = (height * scanYPercent) / 100;
      const laserGrad = ctx.createLinearGradient(0, laserY, width, laserY);
      laserGrad.addColorStop(0, "rgba(218, 165, 32, 0)");
      laserGrad.addColorStop(0.5, "rgba(218, 165, 32, 1)");
      laserGrad.addColorStop(1, "rgba(218, 165, 32, 0)");
      ctx.strokeStyle = laserGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(10, laserY);
      ctx.lineTo(width - 10, laserY);
      ctx.stroke();
    }

    ctx.restore();
  }

  scanAndMatch(personTarget, onComplete) {
    if (this.isScanning) return;
    this.isScanning = true;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      this.drawFingerprint(progress, null);

      if (progress < 40) {
        this.onStateUpdate("[COLOCAR DEDO FIRME EN SENSOR...]", "amber", progress);
      } else if (progress < 80) {
        this.onStateUpdate("[EXTRAYENDO MINUCIAS BIOMÉTRICAS (WSQ)...]", "blue", progress);
      } else {
        this.onStateUpdate("[COTEJANDO CON AFIS / BASE DE DATOS EP...]", "yellow", progress);
      }

      if (progress >= 100) {
        clearInterval(interval);
        this.isScanning = false;
        const isAuth = personTarget.estado_autorizacion === "AUTORIZADO";
        this.drawFingerprint(0, isAuth);
        this.onStateUpdate(
          isAuth ? "[HUELLA DACTILAR VERIFICADA Y CONFORME]" : "[ALERTA: HUELLA REGISTRA IMPEDIMENTO / NO MATCH]",
          isAuth ? "green" : "red",
          100
        );
        if (onComplete) {
          onComplete({
            success: isAuth,
            person: personTarget,
            nfiqQuality: 88,
            minutiaeCount: 54
          });
        }
      }
    }, 45);
  }
}

/**
 * MOTOR DE REGISTRO DE VISITAS POR COMANDO DE VOZ (STT)
 * Adaptado a jerga militar peruana y dependencias del Ejército del Perú
 */
class MilitaryVoiceSTTEngine {
  constructor(onResultCallback, onStateCallback) {
    this.onResult = onResultCallback;
    this.onState = onStateCallback;
    this.isListening = false;
    this.recognition = null;

    // Diccionario militar peruano para corrección y autocompletado inteligente
    this.militaryDictionary = [
      { trigger: /pentagonito|cuartel general/i, value: "Cuartel General del Ejército (Pentagonito)" },
      { trigger: /coede|educaci[oó]n y doctrina/i, value: "Comandancia de Educación y Doctrina del Ejército (COEDE)" },
      { trigger: /comandancia general|cge/i, value: "Comandancia General del Ejército (CGE)" },
      { trigger: /estado mayor|emge/i, value: "Estado Mayor General del Ejército (EMGE)" },
      { trigger: /inspector[ií]a|ige/i, value: "Inspección General del Ejército (IGE)" },
      { trigger: /inteligencia|dinte/i, value: "Dirección de Inteligencia del Ejército (DINTE)" },
      { trigger: /telem[aá]tica|dite/i, value: "Dirección de Telemática y Estadística (DITE)" },
      { trigger: /log[ií]stica|diloge/i, value: "Dirección de Logística del Ejército (DILOGE)" },
      { trigger: /sanidad|cosale|hospital militar/i, value: "Comando de Salud del Ejército (COSALE)" },
      { trigger: /escuela militar|emch/i, value: "Escuela Militar de Chorrillos (EMCH)" },
      { trigger: /escuela t[eé]cnica|ete/i, value: "Escuela Técnica del Ejército (ETE)" },
      { trigger: /pabell[oó]n de oficiales/i, value: "Pabellón de Oficiales Generales" },
      { trigger: /polic[ií]a militar|pm/i, value: "Batallón de Policía Militar N° 501" },
      { trigger: /policl[ií]nico/i, value: "Policlínico Militar de Chorrillos" }
    ];

    this.initSpeechAPI();
  }

  initSpeechAPI() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-PE';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onState("ESCUCHANDO COMANDO DE VOZ...", true);
      };

      this.recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const normalized = this.enrichMilitaryTerms(transcript);
        this.onResult(transcript, normalized, event.results[0].isFinal);
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.isListening = false;
        this.onState("MICRÓFONO INACTIVO / ERROR", false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onState("MICRÓFONO EN ESPERA", false);
      };
    } else {
      console.warn("Web Speech API no disponible en este navegador. Se usará el emulador táctico.");
    }
  }

  enrichMilitaryTerms(rawText) {
    let enriched = rawText;
    for (const item of this.militaryDictionary) {
      if (item.trigger.test(rawText)) {
        return item.value;
      }
    }
    return enriched;
  }

  startListening() {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn("Ya estaba escuchando:", e);
      }
    } else {
      // Simulación automática táctica con presets militares
      this.simulateSpeechPreset("Dirigiéndose a la Comandancia de Educación y Doctrina - COEDE para reunión con Oficial de Prevención");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
    this.onState("MICRÓFONO DETENIDO", false);
  }

  simulateSpeechPreset(text) {
    this.isListening = true;
    this.onState("SIMULANDO CAPTURA DE VOZ TÁCTICA...", true);
    let current = "";
    const words = text.split(" ");
    let index = 0;

    const timer = setInterval(() => {
      if (index < words.length) {
        current += (index > 0 ? " " : "") + words[index];
        const enriched = this.enrichMilitaryTerms(current);
        this.onResult(current, enriched, false);
        index++;
      } else {
        clearInterval(timer);
        this.isListening = false;
        const finalEnriched = this.enrichMilitaryTerms(current);
        this.onResult(current, finalEnriched, true);
        this.onState("TRANSCRIPCIÓN COMPLETADA", false);
      }
    }, 180);
  }
}

// Exportación global para scripts y módulos
window.TacticalSoundSynthesizer = TacticalSoundSynthesizer;
window.EPDatabaseService = EPDatabaseService;
window.FacialLivenessEngine = FacialLivenessEngine;
window.BiometricFingerprintEngine = BiometricFingerprintEngine;
window.MilitaryVoiceSTTEngine = MilitaryVoiceSTTEngine;

