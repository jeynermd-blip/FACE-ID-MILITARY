import 'package:flutter/material.dart';

/// SISTEMA DE CONTROL DE ACCESO MILITAR - EJÉRCITO DEL PERÚ (EP)
/// Implementación Nativa en Flutter para Smartphone y Tablet de Garita
/// Dirección de Telemática y Estadística (DITE)

void main() {
  runApp(const BiometricAccessApp());
}

class BiometricAccessApp extends StatelessWidget {
  const BiometricAccessApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Control de Acceso Militar EP',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF1E2215), // Verde Olivo Profundo
        primaryColor: const Color(0xFF4B5320), // Verde Olivo Militar
        fontFamily: 'monospace',
      ),
      home: const BiometricAccessScreen(),
    );
  }
}

class BiometricAccessScreen extends StatefulWidget {
  const BiometricAccessScreen({super.key});

  @override
  State<BiometricAccessScreen> createState() => _BiometricAccessScreenState();
}

class _BiometricAccessScreenState extends State<BiometricAccessScreen>
    with SingleTickerProviderStateMixin {
  // Paleta Oficial EP
  static const Color colOliveDark = Color(0xFF1E2215);
  static const Color colOliveDeep = Color(0xFF2E331B);
  static const Color colOliveBase = Color(0xFF3B441F);
  static const Color colOlivePrimary = Color(0xFF4B5320);
  static const Color colOliveLight = Color(0xFF556B2F);
  static const Color colAmber = Color(0xFFDAA520);
  static const Color colTacticalGray = Color(0xFF2B2B2B);
  static const Color colRedAlert = Color(0xFFB71C1C);

  int _selectedTab = 0; // 0: Facial, 1: Dactilar, 2: Voz
  String _scanState = 'ESPERA'; // 'ESPERA', 'ESCANEANDO', 'AUTORIZADO', 'DENEGADO'
  late AnimationController _laserController;
  late Animation<double> _laserAnimation;

  final TextEditingController _voiceTextController = TextEditingController();

  final Map<String, dynamic> _militaryOfficer = {
    'cip': '318492010',
    'dni': '45892104',
    'grado': 'Coronel EP',
    'gradoAbrev': 'CRL EP',
    'arma': 'Infantería',
    'apellidos': 'VÁSQUEZ HUAMÁN',
    'nombres': 'Carlos Alberto',
    'unidad': 'Comandancia General del Ejército (CGE)',
    'cargo': 'Jefe de Estado Mayor Operativo',
    'destino': 'Cuartel General - Pabellón A (EMGE)',
    'armaSerie': 'PIST-P226-EP-88412 (30 tiros)',
    'vehiculo': 'Toyota Hilux EP-41029',
    'foto': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
  };

  @override
  void initState() {
    super.initState();
    _laserController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _laserAnimation = Tween<double>(begin: 0.1, end: 0.9).animate(
      CurvedAnimation(parent: _laserController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _laserController.dispose();
    _voiceTextController.dispose();
    super.dispose();
  }

  void _simularEscaneoFacial() {
    setState(() => _scanState = 'ESCANEANDO');
    Future.delayed(const Duration(milliseconds: 2200), () {
      setState(() => _scanState = 'AUTORIZADO');
    });
  }

  void _simularVoz(String frase) {
    setState(() {
      _voiceTextController.text = frase;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: colOliveDark,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(65),
        child: AppBar(
          backgroundColor: colOliveDeep,
          elevation: 4,
          shape: const Border(
            bottom: BorderSide(color: colAmber, width: 2),
          ),
          title: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: colOlivePrimary,
                  shape: BoxShape.circle,
                  border: Border.all(color: colAmber, width: 1.5),
                ),
                child: const Center(
                  child: Text(
                    'EP',
                    style: TextStyle(
                      color: colAmber,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text(
                    'EJÉRCITO DEL PERÚ',
                    style: TextStyle(
                      color: colAmber,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  Text(
                    'Puesto de Control y Prevención',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
          actions: [
            Container(
              margin: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
              padding: const EdgeInsets.symmetric(horizontal: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF171912),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: colOliveBase),
              ),
              child: const Center(
                child: Text(
                  'GARITA-01',
                  style: TextStyle(color: colAmber, fontSize: 10),
                ),
              ),
            ),
          ],
        ),
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isTablet = constraints.maxWidth > 700;
          return Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: isTablet ? 1100 : 480),
              child: isTablet ? _buildTabletLayout() : _buildMobileLayout(),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMobileLayout() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          _buildModuleSelector(),
          const SizedBox(height: 12),
          _buildActiveModule(),
          const SizedBox(height: 12),
          _buildStatusDisplay(),
        ],
      ),
    );
  }

  Widget _buildTabletLayout() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 6,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  _buildModuleSelector(),
                  const SizedBox(height: 14),
                  _buildActiveModule(),
                ],
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            flex: 5,
            child: SingleChildScrollView(
              child: _buildStatusDisplay(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModuleSelector() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: colOliveDeep,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: colOlivePrimary),
      ),
      child: Row(
        children: [
          _tabButton('1. FACIAL', 0, Icons.camera_alt),
          _tabButton('2. DACTILAR', 1, Icons.fingerprint),
          _tabButton('3. VOZ', 2, Icons.mic),
        ],
      ),
    );
  }

  Widget _tabButton(String title, int index, IconData icon) {
    final active = _selectedTab == index;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedTab = index),
        borderRadius: BorderRadius.circular(6),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: active ? colOlivePrimary : Colors.transparent,
            borderRadius: BorderRadius.circular(6),
            border: active ? Border.all(color: colAmber, width: 1) : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 14, color: active ? colAmber : Colors.grey),
              const SizedBox(width: 4),
              Text(
                title,
                style: TextStyle(
                  color: active ? Colors.white : Colors.grey,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActiveModule() {
    switch (_selectedTab) {
      case 0:
        return _buildFacialModule();
      case 1:
        return _buildDactilarModule();
      case 2:
        return _buildVoiceModule();
      default:
        return const SizedBox();
    }
  }

  Widget _buildFacialModule() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF171912),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: colOliveBase),
      ),
      child: Column(
        children: [
          // Visor con retícula militar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              height: 240,
              width: double.infinity,
              color: Colors.black,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Image.network(
                    _militaryOfficer['foto'],
                    fit: BoxFit.cover,
                    width: double.infinity,
                    height: double.infinity,
                  ),
                  Container(color: colOlivePrimary.withOpacity(0.25)),

                  // Retícula Ovalada Militar
                  Container(
                    width: 150,
                    height: 190,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(75),
                      border: Border.all(
                        color: _scanState == 'AUTORIZADO'
                            ? Colors.greenAccent
                            : colAmber,
                        width: 2,
                      ),
                    ),
                  ),

                  // Animación de Láser Táctico
                  AnimatedBuilder(
                    animation: _laserAnimation,
                    builder: (context, child) {
                      return Positioned(
                        top: 240 * _laserAnimation.value,
                        left: 20,
                        right: 20,
                        child: Container(
                          height: 3,
                          decoration: BoxDecoration(
                            color: colAmber,
                            boxShadow: [
                              BoxShadow(
                                color: colAmber.withOpacity(0.8),
                                blurRadius: 10,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                  Positioned(
                    top: 8,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      color: Colors.black82,
                      child: const Text(
                        'IR/RGB LIVENESS: 98.8%',
                        style: TextStyle(color: Colors.greenAccent, fontSize: 9),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),

          // Indicador de Estado
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
            decoration: BoxDecoration(
              color: colOliveDark,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: colOliveBase),
            ),
            child: Center(
              child: Text(
                _scanState == 'ESCANEANDO'
                    ? '[ESCANEANDO ROSTRO Y PRUEBA DE VIDA...]'
                    : _scanState == 'AUTORIZADO'
                        ? '[ACCESO CONCEDIDO: IDENTIDAD VALIDADA]'
                        : '[SISTEMA EN ESPERA - ENCUADRE ROSTRO]',
                style: const TextStyle(
                  color: colAmber,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),

          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: colOlivePrimary,
              foregroundColor: colAmber,
              minimumSize: const Size.fromHeight(45),
              side: const BorderSide(color: colAmber),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
            ),
            onPressed: _simularEscaneoFacial,
            icon: const Icon(Icons.security, size: 16),
            label: const Text(
              'INICIAR ESCANEO FACIAL',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDactilarModule() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF171912),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: colOliveBase),
      ),
      child: Column(
        children: [
          Container(
            width: 140,
            height: 170,
            decoration: BoxDecoration(
              color: Colors.black87,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colOlivePrimary, width: 2),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.fingerprint, size: 70, color: colOliveLight),
                SizedBox(height: 8),
                Text(
                  'SENSOR AFIS ACTIVO',
                  style: TextStyle(color: Colors.grey, fontSize: 8),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: colOlivePrimary,
              foregroundColor: colAmber,
              minimumSize: const Size.fromHeight(45),
              side: const BorderSide(color: colAmber),
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Huella cotejada con éxito en base AFIS-EP')),
              );
            },
            child: const Text('LEER HUELLA DACTILAR'),
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceModule() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF171912),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: colOliveBase),
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: () => _simularVoz('Dirigiéndose a la Comandancia de Educación y Doctrina - COEDE'),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: colOliveDeep,
                shape: BoxShape.circle,
                border: Border.all(color: colAmber, width: 2),
              ),
              child: const Icon(Icons.mic, size: 36, color: colAmber),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'REGISTRAR DESTINO POR VOZ',
            style: TextStyle(color: colAmber, fontSize: 11, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _voiceTextController,
            decoration: InputDecoration(
              filled: true,
              fillColor: colOliveDark,
              hintText: 'Dependencia militar de destino...',
              hintStyle: const TextStyle(color: Colors.grey, fontSize: 11),
              border: OutlineInputBorder(
                borderSide: const BorderSide(color: colOliveBase),
                borderRadius: BorderRadius.circular(6),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusDisplay() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF171912),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: colOliveLight, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner Verde Olivo Claro
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: colOliveLight,
              borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: const [
                Text(
                  '✓ ACCESO AUTORIZADO',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                ),
                Text('VALIDADO EP', style: TextStyle(color: Colors.white70, fontSize: 9)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: Image.network(_militaryOfficer['foto'], width: 55, height: 55, fit: BoxFit.cover),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${_militaryOfficer['gradoAbrev']} - ${_militaryOfficer['arma']}',
                            style: const TextStyle(color: colAmber, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            _militaryOfficer['apellidos'],
                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'CIP: ${_militaryOfficer['cip']}',
                            style: const TextStyle(color: Colors.grey, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(color: colOliveBase, height: 16),
                _infoRow('Unidad:', _militaryOfficer['unidad']),
                _infoRow('Destino:', _militaryOfficer['destino']),
                _infoRow('Armamento:', _militaryOfficer['armaSerie']),
                _infoRow('Vehículo:', _militaryOfficer['vehiculo']),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 75,
            child: Text(label, style: const TextStyle(color: Colors.grey, fontSize: 10)),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}

