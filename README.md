# SISTEMA DE CONTROL DE ACCESO MILITAR Y REGISTRO BIOMÉTRICO (SIPRE-BIO EP)
### EJÉRCITO DEL PERÚ — DIRECCIÓN DE TELEMÁTICA Y ESTADÍSTICA (DITE)

---

## 1. DESCRIPCIÓN GENERAL DEL SISTEMA
El **Sistema de Control de Acceso y Prevención Biométrico Militar (SIPRE-BIO EP)** ha sido diseñado y optimizado para terminales móviles tácticos (Smartphones en patrullaje de ronda) y tablets de alta resolución empotradas en garitas de prevención de dependencias de alta seguridad del **Ejército del Perú (EP)** (ej. Cuartel General del Ejército / "Pentagonito", COEDE, Escuela Militar de Chorrillos, Polvorines Generales y Batallones de Policía Militar).

El sistema combina tres tecnologías de captura en tiempo real:
1. **Reconocimiento Facial con Retícula Militar y Detección de Vida Activa (Liveness Detection).**
2. **Reconocimiento Dactilar con Barrido Láser Táctico (Cotejo AFIS con base de datos CIP/DNI).**
3. **Registro de Visitas Asistido por Comando de Voz (STT) con Diccionario de Dependencias Militares Peruanas.**

---

## 2. ARQUITECTURA DE ARCHIVOS DEL PROYECTO

```
FACE ID EIE/
│
├── index.html                           # Aplicación Web Táctica Completa (HTML5 + Tailwind CSS + Audio Synthesizer)
│                                        # Ejecutable directamente en cualquier navegador, móvil o tablet de garita
│
├── js/
│   └── simulation_logic.js              # Motores biométricos: FacialLivenessEngine, BiometricFingerprintEngine,
│                                        # MilitaryVoiceSTTEngine, TacticalSoundSynthesizer y EPDatabaseService
│
├── data/
│   └── ep_database_schema.json          # Especificación formal JSON de contratos API, peticiones y respuestas EP
│
├── mobile_react_native/
│   └── BiometricAccessScreen.jsx        # Componente nativo para React Native / Expo para despliegue en Android / iOS
│
└── README.md                            # Manual operativo, guía de integración de hardware y documentación técnica
```

---

## 3. IDENTIDAD INSTITUCIONAL Y PALETA DE COLORES (UI/UX)

| Elemento Visual | Código Hex | Uso Operativo |
| :--- | :--- | :--- |
| **Verde Olivo Primario** | `#4B5320` / `#3B441F` | Botones de acción militar, bordes principales y acentos de interfaz |
| **Verde Camuflaje Profundo** | `#2E331B` | Contenedores secundarios y barras de módulos |
| **Gris Táctico / Carbón** | `#2B2B2B` / `#171912` | Módulos oscuros para minimizar fatiga ocular y consumo OLED nocturno |
| **Fondo Profundo** | `#1E2215` | Lienzo principal táctico antireflejo bajo luz solar directa |
| **Dorado Militar / Ámbar** | `#DAA520` | Retículas HUD, telemetría militar, advertencias y sol incaico institucional |
| **Verde Olivo Claro (Autorizado)** | `#4CAF50` / `#556B2F` | Banner de acceso autorizado e insignias de validación conforme |
| **Rojo Táctico (DEFCON 1 / Alerta)** | `#B71C1C` | Banner de restricción, orden judicial, requisitoria y alarma acústica |

---

## 4. FUNCIONALIDAD DE LOS MÓDULOS

### Módulo 1: Reconocimiento Facial (Cámara)
- **Visor Militar con HUD:** Muestra un visor central con retícula de esquinas doradas militar, cuadrícula táctica, línea de barrido de láser verde y guía ovalada segmentada para encuadre del rostro.
- **Flujo de Estados en Tiempo Real:**
  $$\text{[ESCANEANDO ROSTRO ENCUADRADO...]} \longrightarrow \text{[PRUEBA DE VIDA: PARPADEO Y GIRO CONFIRMADO]} \longrightarrow \text{[VERIFICANDO EN BASE DE DATOS EP (DITE)]} \longrightarrow \text{[ACCESO CONCEDIDO / DENEGADO]}$$
- **Detección de Vida (Liveness Detection):** Detección de parpadeo biológico (*eye blink*), micro-rotación cefálica ($\pm 8.4^{\circ}$) y filtro anti-spoofing para impedir suplantación fotográfica estática o en pantallas de vídeo.
- **Soporte Dual:** Puede alternar en vivo entre la cámara web/dispositivo real mediante WebRTC o el simulador óptico militar táctico.

### Módulo 2: Reconocimiento Dactilar (AFIS-EP)
- Sensor interactivo con canvas gráfico táctico que representa las crestas papilares y barrido láser vertical.
- Soporta integración con lectores biométricos ópticos o capacitivos externos (USB / Bluetooth, ej. Suprema, DigitalPersona U.are.U, ARH/HID).
- Cotejo en tiempo real de minucias (score de calidad NFIQ2 $> 80$, con extracción de más de 50 puntos característicos).

### Módulo 3: Registro de Visitas por Comando de Voz
- Botón prominente de activación de micrófono ("REGISTRAR DESTINO POR VOZ") con indicación visual de ondas sonoras en tiempo real.
- Motor de conversión Voz a Texto (STT) que utiliza la Web Speech API en `es-PE` con normalización automática de dependencias militares:
  - *"Pentagonito"* $\rightarrow$ **Cuartel General del Ejército (Pentagonito)**
  - *"COEDE"* $\rightarrow$ **Comandancia de Educación y Doctrina del Ejército (COEDE)**
  - *"CGE"* $\rightarrow$ **Comandancia General del Ejército (CGE)**
  - *"EMGE"* $\rightarrow$ **Estado Mayor General del Ejército (EMGE)**
  - *"Pabellón de Oficiales"* $\rightarrow$ **Pabellón de Oficiales Generales**
  - *"Inteligencia"* $\rightarrow$ **Dirección de Inteligencia del Ejército (DINTE)**
  - *"Telemática"* $\rightarrow$ **Dirección de Telemática y Estadística (DITE)**
- Confirmación visual interactiva: Permite editar el texto transcrito con el teclado o confirmar con un solo clic/comando de voz para transferirlo al pase de visita oficial.

---

## 5. ESTADOS Y ALERTAS DEL SISTEMA

1. **Estado 1: Acceso Autorizado:**
   - Banner superior en Verde Olivo Claro (`#4CAF50` / `#556B2F`).
   - Muestra: Grado abreviado (ej. `CRL EP`, `T1 EP`), Arma o Servicio (Infantería, Material de Guerra, Artillería), Apellidos y Nombres, CIP, DNI, Unidad militar de origen, Hora exacta de ingreso (-05 UTC), Destino asignado, Porte de arma reglamentaria (serie y munición de dotación) y vehículo autorizado con placa oficial.
   - Sonido acústico táctico de confirmación (3 tonos armónicos ascendentes generados con Web Audio API).

2. **Estado 2: Acceso Denegado / Alerta Táctica:**
   - Banner superior en Rojo Táctico (`#B71C1C`).
   - Sonido de alarma tipo sirena táctica de 3 pulsos descendentes.
   - Detalle de la restricción: *"ORDEN DE IMPEDIMENTO DE ACCESO A INSTALACIONES MILITARES E INVESTIGACIÓN EN CURSO POR INSPECTORÍA GENERAL DEL EJÉRCITO (IGE)"*.
   - Botón interactivo: **"NOTIFICAR AL OFICIAL DE GUARDIA (PM 501)"**, que abre un modal con comunicación directa para ordenar el despacho de la patrulla del Batallón de Policía Militar N° 501 a la Sala de Prevención.

3. **Estado 3: Registro de Visita Externa:**
   - Formulario táctico con autocompletado mediante DNI (consulta RENIEC simulada) o mediante la captura por voz.
   - Asignación automática de código de pase numerado (`VIS-2026-XXXX`) con indicación de hora límite de salida e ingreso en la bitácora criptográfica del puesto de control.

---

## 6. ESTRUCTURA JSON DE RESPUESTA SIMULADA

El sistema utiliza la especificación formal definida en `data/ep_database_schema.json`:

```json
{
  "codigo_respuesta": "EP-AUTH-200",
  "estado_autorizacion": "AUTORIZADO",
  "nivel_alerta": "VERDE_DEFCON_5",
  "timestamp_evaluacion": "2026-11-07T10:15:30.450-05:00",
  "personal": {
    "cip": "318492010",
    "dni": "45892104",
    "grado": "Coronel EP",
    "grado_abreviado": "CRL EP",
    "arma_servicio": "Infantería",
    "apellidos": "VÁSQUEZ HUAMÁN",
    "nombres": "Carlos Alberto",
    "unidad_actual": "Comandancia General del Ejército (CGE)",
    "cargo": "Jefe de Estado Mayor Operativo",
    "nivel_seguridad": "SECRETO_MILITAR_NIVEL_3",
    "porte_arma_reglamentaria": {
      "autorizado": true,
      "serie_arma": "PIST-P226-EP-88412",
      "municion_dotacion": "30 tiros 9x19mm"
    }
  },
  "control_ingreso": {
    "tipo_pase": "PERMANENTE_OFICIAL",
    "garita_acceso": "Garita N° 1 - Prevención San Borja",
    "destino_predeterminado": "Cuartel General del Ejército - Pabellón A",
    "vehiculo_autorizado": {
      "placa": "EP-41029",
      "marca_modelo": "Toyota Hilux 4x4 Verde OTAN"
    }
  },
  "biometria_match": {
    "score_coincidencia": 0.991,
    "metodo_predominante": "FACIAL_DEEP_DESCRIPTOR",
    "tiempo_computo_ms": 132
  }
}
```

---

## 7. ENLACE PÚBLICO EN INTERNET Y CÓDIGO QR (DEMO EN VIVO)

El sistema ha sido publicado y está disponible en línea para accederlo, probarlo y compartirlo desde cualquier dispositivo (Smartphone, Tablet o PC):

👉 **Enlace de Acceso Público Oficial:**  
[https://ejercito-peru-control-lwj0h81qyw.brewpage.app/](https://ejercito-peru-control-lwj0h81qyw.brewpage.app/)

📱 **Archivos de Código QR generados en el repositorio:**
- [qr_acceso_militar.png](file:///c:/Users/TOSHIBA/Documents/APPS/FACE%20ID%20EIE/qr_acceso_militar.png) (Alta resolución 600x600 PNG para imprimir en gafetes o garitas)
- [qr_acceso_militar.svg](file:///c:/Users/TOSHIBA/Documents/APPS/FACE%20ID%20EIE/qr_acceso_militar.svg) (Formato vectorial escalable infinito)

---

## 8. NUEVAS FUNCIONALIDADES OPERATIVAS IMPLEMENTADAS

1. **Búsqueda Táctica Rápida por CIP / DNI / Placa:**
   - Permite al guardia de prevención ingresar directamente un CIP militar (ej: `318492010`), número de DNI o placa de vehículo (`EP-41029`) para cargar instantáneamente su perfil y estado de autorización.
2. **Generador e Impresión de Pase Oficial de Visita Militar:**
   - Al registrar una visita civil externa o de otra institución (MINDEF), el sistema emite un boleto/pase imprimible térmico con código QR individual de salida, oficial anfitrión, hora exacta de ingreso y hora límite de permanencia autorizada (4 horas).
3. **Exportación Criptográfica del Parte de Prevención:**
   - Botón **"Exportar CSV"** en la bitácora que genera el archivo estructurado para el Parte Diario de Guardia.
   - Botón **"Imprimir Parte"** adaptado con estilos `@media print` para hojas A4 oficiales del Ejército.
4. **Implementación Nativa Multiplataforma (Flutter & React Native):**
   - [biometric_access_screen.dart](file:///c:/Users/TOSHIBA/Documents/APPS/FACE%20ID%20EIE/mobile_flutter/biometric_access_screen.dart): Código nativo en Flutter optimizado con `LayoutBuilder` para teléfonos y tablets.
   - [BiometricAccessScreen.jsx](file:///c:/Users/TOSHIBA/Documents/APPS/FACE%20ID%20EIE/mobile_react_native/BiometricAccessScreen.jsx): Componente nativo para React Native / Expo.

---

## 8. CÓMO EJECUTAR LOCALMENTE O SUBIR A OTROS SERVIDORES

1. **Ejecución Inmediata en Navegador:**
   - Abra el archivo `index.html` con cualquier navegador moderno (Google Chrome, Microsoft Edge, Safari o Firefox).
   - Puede probar tanto en su computadora como en dispositivos móviles o tablets transfiriendo el archivo o sirviéndolo en su red local.
2. **Selector de Dispositivo:**
   - En la barra superior, presione **"Móvil"** para visualizar la distribución compacta de un celular de mano, o **"Garita"** para la distribución horizontal para tablets en soporte.
3. **Prueba de Perfiles:**
   - Use la barra superior de perfiles para alternar entre el **CRL EP Vásquez** (Acceso Autorizado), el **T1 EP Quispe** (Material de Guerra), o el **CAP EP (R) Mendoza** (Alerta Roja / Orden Judicial).
4. **Activación de Cámara Real:**
   - En el módulo facial, haga clic en *"Usar Cámara Web"* para encender su cámara física en el visor táctico HUD.

